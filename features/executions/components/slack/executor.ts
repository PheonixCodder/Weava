import { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";

Handlebars.registerHelper("json", function (context) {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type SlackData = {
  variableName?: string;
  content?: string;
  webhookUrl?: string;
};

export const SlackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    slackChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
        error: "User Message is required",
      })
    );
    throw new NonRetriableError("Slack Node: User Message is required");
  }
  if (!data.variableName) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
        error: "Variable name is required",
      })
    );
    throw new NonRetriableError("Slack Node: Variable name is required");
  }
  if (!data.webhookUrl) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
        error: "Webhook URL is required",
      })
    );
    throw new NonRetriableError("Slack Node: Webhook URL is required");
  }
  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const webhookUrl = data.webhookUrl;

  try {
    const result = await step.run("slack-webhook", async () => {
      await ky.post(webhookUrl, {
        json: {
          content: content
        },
      });
      return {
        ...context,
        [data.variableName!]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });
    await publish(
      slackChannel().status({
        nodeId,
        status: "success",
      })
    );
    return result;
  } catch (error) {
    await publish(
      slackChannel().status({
        nodeId,
        status: "error",
        error: (error as Error).message,
      })
    );
    throw error;
  }
};
