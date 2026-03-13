export type AgentRunStatus =
  | "queued"
  | "planning"
  | "executing"
  | "waiting_tool"
  | "completed"
  | "failed";

export type AgentType =
  | "planner"
  | "builder"
  | "analysis"
  | "workflow"
  | "deployment";

export type AgentStepType =
  | "prompt"
  | "tool_call"
  | "tool_result"
  | "reasoning"
  | "final_output";

export type AgentStep = {
  type: AgentStepType;
  title: string;
  payloadJson?: Record<string, unknown>;
};

export type AgentDefinition = {
  name: string;
  description: string;
  type: AgentType;
  tools?: string[];
};
