"use client"

import { NodeToolbar, Position } from "@xyflow/react"
import { SettingsIcon, TrashIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "../ui/button"

interface WorkflowNodeProps {
    children?: ReactNode
    showToolbars?: boolean
    onDelete?: () => void
    onSettings?: () => void
    name?: string
    description?: string
}

export function WorkflowNode({
    children,
    showToolbars = true,
    onDelete,
    onSettings,
    name,
    description,
}: WorkflowNodeProps) {
    return (
        <>
        {showToolbars && (
            <NodeToolbar position={Position.Right}>
                <Button size="sm" variant="ghost" onClick={onSettings}>
                    <SettingsIcon className="size-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onDelete}>
                    <TrashIcon className="size-4" />
                </Button>
            </NodeToolbar>
        )}
        {children}
        {name && (
            <NodeToolbar position={Position.Bottom} isVisible className="max-w-[200px] text-center">
                <p className="font-medium">
                    {name}
                </p>
                {description && <p className="text-xs truncate text-muted-foreground">{description}</p>}
            </NodeToolbar>
        )}
        </>
    )
}