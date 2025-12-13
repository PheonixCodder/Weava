import { channel, topic } from "@inngest/realtime";

export const discordChannel = channel("discord").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "pending" | "success" | "error" | "loading";
    error?: string;
  }>()
);
