import { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { geminiChannel } from "@/inngest/channels/gemini";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { type GoogleGenerativeAIModelId } from "@ai-sdk/google";

Handlebars.registerHelper("json", function (context) {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type GeminiData = {
  variableName?: string;
  model?: GoogleGenerativeAIModelId[number];
  systemPrompt?: string;
  userPrompt?: string;
};

export const GeminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    geminiChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.userPrompt) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
        error: "User prompt is required",
      })
    );
    throw new NonRetriableError("Gemini Node: User prompt is required");
  }
  if (!data.variableName) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
        error: "Variable name is required",
      })
    );
    throw new NonRetriableError("Gemini Node: Variable name is required");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful AI assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);
  const credentialValue = "YOUR_GOOGLE_CREDENTIALS_JSON";

  const google = createGoogleGenerativeAI({
    apiKey: credentialValue,
  });

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google(data.model || "gemini-1.5-flash"),
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
      geminiChannel().status({
        nodeId,
        status: "success",
      })
    );
    return {
      ...context,
      [data.variableName || `gemini_response_${nodeId}`]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
        error: (error as Error).message,
      })
    );
    throw error;
  }
};
