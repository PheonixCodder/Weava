import { channel, topic } from "@inngest/realtime";

export const anthropicChannel = channel("anthropic").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "pending" | "success" | "error" | "loading";
    error?: string;
  }>()
);
