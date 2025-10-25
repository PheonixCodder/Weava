"use client"
import { NodeProps } from "@xyflow/react"
import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"
import { PlaceholderNode } from "../react-flow/placeholder-node"
import { nodeComponents } from "@/config/node-components"
import { NodeSelector } from "../react-flow/node-selector"


export const InitialNode = memo((props: NodeProps) => {
    const [selectorOpen, setSelectorOpen] = useState(false)
    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
        <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
            <div className="flex items-center justify-center cursor-pointer">
                <PlusIcon className="size-4" />
            </div>
        </PlaceholderNode>
    </NodeSelector>
    )
})

export type RegisteredNodeType = keyof typeof nodeComponents