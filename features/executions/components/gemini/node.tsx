"use client";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { availableModels, GeminiDialog, GeminiFormValues } from './dialog';
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";
import { geminiChannel } from "@/inngest/channels/gemini";



type GeminiNodeData = {
  variableName?: string;
  model?: typeof availableModels[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const nodeData = props.data;
  const description = nodeData.userPrompt
    ? `${nodeData.model || availableModels[0]}: ${nodeData.userPrompt.slice(0, 30)}...`
    : "Not configured";

  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: geminiChannel().name,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken
  });

  const handleSubmit = (values: GeminiFormValues) => {
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
    <GeminiDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData} />
      <BaseExecutionNode
        status={nodeStatus}
        {...props}
        id={props.id}
        Icon={'/images/gemini.svg'}
        name="Gemini"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
