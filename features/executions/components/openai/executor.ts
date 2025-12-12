import { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { availableModels } from "./dialog";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { openaiChannel } from "@/inngest/channels/openai";
import { createOpenAI } from "@ai-sdk/openai";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", function (context) {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type OpenAIData = {
  variableName?: string;
  model?: (typeof availableModels)[number];
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

export const OpenAIExecutor: NodeExecutor<OpenAIData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    openaiChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.userPrompt) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
        error: "User prompt is required",
      })
    );
    throw new NonRetriableError("OpenAI Node: User prompt is required");
  }
  if (!data.variableName) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
        error: "Variable name is required",
      })
    );
    throw new NonRetriableError("OpenAI Node: Variable name is required");
  }
  if (!data.credentialId) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
        error: "Credential ID is required",
      })
    );
    throw new NonRetriableError("OpenAI Node: Credential ID is required");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful AI assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.ai.wrap("get-credential", () => {
    return prisma.credential.findUnique({
      where: { id: data.credentialId, userId: context.userId as string },
    });
  });

  if (!credential) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
        error: "Credential not found",
      })
    );
    throw new NonRetriableError("OpenAI Node: Credential not found");
  }

  const google = createOpenAI({
    apiKey: credential?.value,
  });

  try {
    const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: google(data.model || availableModels[0]),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      openaiChannel().status({
        nodeId,
        status: "success",
      })
    );
    return {
      ...context,
      [data.variableName || `openai_response_${nodeId}`]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
        error: (error as Error).message,
      })
    );
    throw error;
  }
};
