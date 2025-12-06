import { channel, topic } from "@inngest/realtime";

export const geminiChannel = channel("gemini").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "pending" | "success" | "error" | "loading";
    error?: string;
  }>()
);
