export type AgentMemoryRecord = {
  id: string
  agentRunId: string
  content: string
  createdAt: string
}

export type KnowledgeNode = {
  id: string
  label: string
  description?: string
}

export type ReasoningEdge = {
  fromNodeId: string
  toNodeId: string
  relation: string
}
