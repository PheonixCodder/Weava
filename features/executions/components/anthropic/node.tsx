"use client";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { availableModels, AnthropicFormValues, AnthropicDialog } from './dialog';
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchAnthropicRealtimeToken } from "./actions";
import { anthropicChannel } from "@/inngest/channels/anthropic";



type AnthropicNodeData = {
  variableName?: string;
  model?: typeof availableModels[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const nodeData = props.data;
  const description = nodeData.userPrompt
    ? `${nodeData.model || availableModels[0]}: ${nodeData.userPrompt.slice(0, 30)}...`
    : "Not configured";

  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: anthropicChannel().name,
    topic: "status",
    refreshToken: fetchAnthropicRealtimeToken
  });

  const handleSubmit = (values: AnthropicFormValues) => {
    setNodes((nodes) => {``
      return nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      });
    });
  }

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
    <AnthropicDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData} />
      <BaseExecutionNode
        status={nodeStatus}
        {...props}
        id={props.id}
        Icon={'/images/anthropic.svg'}
        name="Anthropic"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

AnthropicNode.displayName = "AnthropicNode";
