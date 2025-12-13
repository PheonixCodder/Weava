import { discordChannel } from "@/inngest/channels/discord";
import { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";

Handlebars.registerHelper("json", function (context) {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type DiscordData = {
  variableName?: string;
  content?: string;
  webhookUrl?: string;
  username?: string;
};

export const DiscordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.content) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
        error: "User prompt is required",
      })
    );
    throw new NonRetriableError("Discord Node: User prompt is required");
  }
  if (!data.variableName) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
        error: "Variable name is required",
      })
    );
    throw new NonRetriableError("Discord Node: Variable name is required");
  }
  if (!data.username) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
        error: "Credential ID is required",
      })
    );
    throw new NonRetriableError("Discord Node: Credential ID is required");
  }
  if (!data.webhookUrl) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
        error: "Webhook URL is required",
      })
    );
    throw new NonRetriableError("Discord Node: Webhook URL is required");
  }
  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const userName = data.username
    ? Handlebars.compile(data.username)(context)
    : "Weava Bot";
  const webhookUrl = data.webhookUrl;

  try {
    const result = await step.run("discord-webhook", async () => {
      await ky.post(webhookUrl, {
        json: {
          username: userName,
          content: content.slice(0, 2000), // Discord message limit
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
      discordChannel().status({
        nodeId,
        status: "success",
      })
    );
    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
        error: (error as Error).message,
      })
    );
    throw error;
  }
};
