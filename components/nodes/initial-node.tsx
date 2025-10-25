"use client"
import { NodeProps } from "@xyflow/react"
import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"
import { PlaceholderNode } from "../react-flow/placeholder-node"
import { nodeComponents } from "@/config/node-components"


export const InitialNode = memo((props: NodeProps) => {
    return (
        <PlaceholderNode {...props}>
            <div className="flex items-center justify-center cursor-pointer">
                <PlusIcon className="size-4" />
            </div>
        </PlaceholderNode>
    )
})

export type RegisteredNodeType = keyof typeof nodeComponents