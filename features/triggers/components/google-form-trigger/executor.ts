import { NodeExecutor } from "@/features/executions/type";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form";

type googleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<googleFormTriggerData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "loading",
    })
  );
  const result = await step.run(`google-form`, async () => context);

  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};
