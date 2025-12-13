import prisma from '@/lib/db';
import { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { availableModels } from "./dialog";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { createAnthropic } from "@ai-sdk/anthropic";

Handlebars.registerHelper("json", function (context) {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type AnthropicData = {
  variableName?: string;
  model?: (typeof availableModels)[number];
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

export const AnthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  context,
  step,
  userId,
  publish,
}) => {
  await publish(
    anthropicChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.userPrompt) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
        error: "User prompt is required",
      })
    );
    throw new NonRetriableError("Anthropic Node: User prompt is required");
  }
  if (!data.variableName) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
        error: "Variable name is required",
      })
    );
    throw new NonRetriableError("Anthropic Node: Variable name is required");
  }
  if (!data.credentialId) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
        error: "Credential ID is required",
      })
    );
    throw new NonRetriableError("Anthropic Node: Credential ID is required");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful AI assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.ai.wrap("get-credential", () => {
    return prisma.credential.findUnique({
      where: { id: data.credentialId, userId },
    });
  });
  
  if (!credential) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
        error: "Credential not found",
      })
    );
    throw new NonRetriableError("Anthropic Node: Credential not found");
  }

  const anthropic = createAnthropic({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      model: anthropic(data.model || availableModels[0]),
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
      anthropicChannel().status({
        nodeId,
        status: "success",
      })
    );
    return {
      ...context,
      [data.variableName || `anthropic_response_${nodeId}`]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
        error: (error as Error).message,
      })
    );
    throw error;
  }
};
