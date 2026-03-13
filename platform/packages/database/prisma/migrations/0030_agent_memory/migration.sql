CREATE TABLE "AgentMemory" (
 id TEXT PRIMARY KEY,
 agentRunId TEXT NOT NULL,
 content TEXT NOT NULL,
 createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AgentKnowledgeNode" (
 id TEXT PRIMARY KEY,
 label TEXT NOT NULL,
 description TEXT
);

CREATE TABLE "AgentReasoningEdge" (
 id TEXT PRIMARY KEY,
 fromNodeId TEXT NOT NULL,
 toNodeId TEXT NOT NULL,
 relation TEXT
);
