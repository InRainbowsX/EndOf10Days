import { archiveEdges, archiveNodes, type ArchiveEdge, type ArchiveNode } from './archiveData';

export function getNodeById(nodeId: string): ArchiveNode {
  return archiveNodes.find((node) => node.id === nodeId) ?? archiveNodes[0];
}

export function getConnectedEdges(nodeId: string): ArchiveEdge[] {
  return archiveEdges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
}

export function getConnectedNodes(nodeId: string): Array<{ edge: ArchiveEdge; node: ArchiveNode }> {
  return getConnectedEdges(nodeId).map((edge) => {
    const linkedId = edge.source === nodeId ? edge.target : edge.source;
    return {
      edge,
      node: getNodeById(linkedId),
    };
  });
}
