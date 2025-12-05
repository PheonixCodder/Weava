import { NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseTriggerNode } from "../base-trigger-node"
import { StripeTriggerDialog } from "./dialog"
import { stripeTriggerRealtimeToken } from "./actions"
import { useNodeStatus } from "@/features/executions/hooks/use-node-status"
import { stripeTriggerChannel } from "@/inngest/channels/stripe"

export const StripeTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: stripeTriggerChannel().name,
    topic: "status",
    refreshToken: stripeTriggerRealtimeToken
  });

    const handleOpenSettings = () => {
        setDialogOpen(true)
    }

    return (
        <>
        <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        <BaseTriggerNode status={nodeStatus} {...props} Icon="/images/stripe.svg" name="Stripe" description="Trigger Stripe event" onSettings={handleOpenSettings} onDoubleClick={handleOpenSettings} />
        </>
    )
})