import { NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseTriggerNode } from "../base-trigger-node"
import { MousePointerIcon } from "lucide-react"
import { ManualTriggerDialog } from "./dialog"
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger"
import { manualTriggerRealtimeToken } from "./actions"
import { useNodeStatus } from "@/features/executions/hooks/use-node-status"

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: manualTriggerChannel().name,
    topic: "status",
    refreshToken: manualTriggerRealtimeToken
  });

    const handleOpenSettings = () => {
        setDialogOpen(true)
    }

    return (
        <>
        <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        <BaseTriggerNode status={nodeStatus} {...props} Icon={MousePointerIcon} name="Execute Workflow" description="Trigger manually" onSettings={handleOpenSettings} onDoubleClick={handleOpenSettings} />
        </>
    )
})