import { channel, topic } from "@inngest/realtime";

export const googleFormTriggerChannel = channel("google-form").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "pending" | "success" | "error" | "loading";
    error?: string;
  }>()
);
