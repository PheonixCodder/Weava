import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topoLogicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@prisma/client";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form";
import { stripeTriggerChannel } from "./channels/stripe";
import { geminiChannel } from "./channels/gemini";
import { discordChannel } from "./channels/discord";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 0, onFailure: async ({ event, step }) => {
    return prisma.execution.updateMany({
      where: { inngestEventId: event.data.event.id },
      data: { status: ExecutionStatus.FAILED, completedAt: new Date(), error: event.data.error.message, errorStack: event.data.error.stack }
    })
  }},
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      discordChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data?.workflowId;
    const inngestEventId = event.id;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("No workflow ID or Inngest ID provided");
    }

    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          inngestEventId,
          workflowId,
        },
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connection: true },
      });
      return topoLogicalSort(workflow.nodes, workflow.connection);
    });

    const userId = await step.run("get-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { userId: true },
      });
      return workflow?.userId;
    });

    let context = event.data.InitialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);

      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        userId,
        step,
        publish,
      });
    }

    await step.run("update-execution", async () => {
      return prisma.execution.updateMany({
        where: { inngestEventId, workflowId },
        data: { status: ExecutionStatus.SUCCESS, completedAt: new Date(), output: context },
      });
    });

    return { workflowId, result: context };
  }
);
