"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { type LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import {
  BaseNode,
  BaseNodeContent,
} from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/nodes/workflows-node";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
  Icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  status: NodeStatus
  onSettings: () => void;
  onDoubleClick: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    Icon,
    name,
    description,
    status = "initial",
    children,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {

    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      setNodes((currentNodes) => {
        const updatedNodes = currentNodes.filter((node) => node.id !== id);
        return updatedNodes;
      });
      setEdges((currentEdges) => {
        const updatedEdges = currentEdges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );
        return updatedEdges;
      });
    };
    return (
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <NodeStatusIndicator variant="border" status={status}>
        <BaseNode status={status} onDoubleClick={onDoubleClick}>
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <img src={Icon} alt={name} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle id={"main"} type="target" position={Position.Left} />
            <BaseHandle id={"main"} type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  }
);

BaseExecutionNode.displayName = "BaseExecutionNode";
