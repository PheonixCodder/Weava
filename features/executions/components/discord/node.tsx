"use client";

import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { type NodeProps, Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { DiscordDialog, DiscordFormValues } from './dialog';
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRealtimeToken } from "./actions";
import { discordChannel } from "@/inngest/channels/discord";



type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const nodeData = props.data;
  const description = nodeData.content
    ? `Send: ${nodeData.content.slice(0, 30)}...`
    : "Not configured";

  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow()

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: discordChannel().name,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken
  });

  const handleSubmit = (values: DiscordFormValues) => {
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
    <DiscordDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultValues={nodeData} />
      <BaseExecutionNode
        status={nodeStatus}
        {...props}
        id={props.id}
        Icon={'/images/discord.svg'}
        name="Discord"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
