"use client";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { availableModels, OpenAIDialog, OpenAIFormValues } from './dialog';
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAIRealtimeToken } from "./actions";
import { openaiChannel } from "@/inngest/channels/openai";



type OpenAINodeData = {
  variableName?: string;
  model?: typeof availableModels[number];
  systemPrompt?: string;
  userPrompt?: string;
  credentialId?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const nodeData = props.data;
  const description = nodeData.userPrompt
    ? `${nodeData.model || availableModels[0]}: ${nodeData.userPrompt.slice(0, 30)}...`
    : "Not configured";

  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: openaiChannel().name,
    topic: "status",
    refreshToken: fetchOpenAIRealtimeToken
  });

  const handleSubmit = (values: OpenAIFormValues) => {
    setNodes((nodes) => {
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
    <OpenAIDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData} />
      <BaseExecutionNode
        status={nodeStatus}
        {...props}
        id={props.id}
        Icon={'/images/openai.svg'}
        name="OpenAI"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

OpenAINode.displayName = "OpenAINode";
