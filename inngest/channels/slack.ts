import { channel, topic } from "@inngest/realtime";

export const slackChannel = channel("slack").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "pending" | "success" | "error" | "loading";
    error?: string;
  }>()
);
