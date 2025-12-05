import { channel, topic } from "@inngest/realtime";

export const httpRequestChannel = channel("http-request").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "pending" | "success" | "error" | "loading";
    error?: string;
  }>()
);
