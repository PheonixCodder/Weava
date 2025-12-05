import { NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseTriggerNode } from "../base-trigger-node"
import { MousePointerIcon } from "lucide-react"
import { GoogleFormTriggerDialog } from "./dialog"
import { googleFormTriggerChannel } from "@/inngest/channels/google-form"
import { googleFormTriggerRealtimeToken } from "./actions"
import { useNodeStatus } from "@/features/executions/hooks/use-node-status"

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: googleFormTriggerChannel().name,
    topic: "status",
    refreshToken: googleFormTriggerRealtimeToken
  });

    const handleOpenSettings = () => {
        setDialogOpen(true)
    }

    return (
        <>
        <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        <BaseTriggerNode status={nodeStatus} {...props} Icon="/images/googleform.svg" name="Google Form" description="Trigger Google Form" onSettings={handleOpenSettings} onDoubleClick={handleOpenSettings} />
        </>
    )
})