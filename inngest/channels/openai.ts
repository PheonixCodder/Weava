import { channel, topic } from "@inngest/realtime";

export const openaiChannel = channel("openai").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "pending" | "success" | "error" | "loading";
    error?: string;
  }>()
);
