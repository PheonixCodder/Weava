import { Connection, Node } from "@prisma/client";
import toposort from "toposort";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

export const topoLogicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  if (connections.length === 0) return nodes;

  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId!,
    conn.toNodeId!,
  ]);

  const connectedNodeIds = new Set<string>();

  for (const conn of connections) {
    connectedNodeIds.add(conn.fromNodeId);
    connectedNodeIds.add(conn.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      // Add a self-loop to ensure the node is included in the sort
      edges.push([node.id, node.id]);
    }
  }

  let sortedNodeIds: string[];

  try {
    sortedNodeIds = toposort(edges);

    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error(
        "Workflow contains a cycle. Please remove cycles to proceed."
      );
    }
    throw error;
  }

  const nodeMap = new Map<string, Node>(nodes.map((node) => [node.id, node]));

  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  [key: string]: any;
}) => {
  return await inngest.send({
    name: "workflows/execute.workflow",
    data,
    id: createId(),
  });
}