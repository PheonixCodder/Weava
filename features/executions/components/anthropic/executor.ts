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
};

export const AnthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  context,
  step,
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

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful AI assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);
  const credentialValue = "YOUR_GOOGLE_CREDENTIALS_JSON";

  const anthropic = createAnthropic({
    apiKey: credentialValue,
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
