import { channel, topic } from "@inngest/realtime";

export const stripeTriggerChannel = channel("stripe").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "pending" | "success" | "error" | "loading";
    error?: string;
  }>()
);
