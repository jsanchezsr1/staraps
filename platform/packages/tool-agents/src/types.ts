export type ToolAgentToolName =
  | "generator"
  | "deployment"
  | "database"
  | "preview"
  | "artifact_store"
  | "external_api";

export type ToolInvocationStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export type ToolDefinition = {
  name: ToolAgentToolName;
  description: string;
  inputSchemaJson?: Record<string, unknown>;
};

export type ToolInvocation = {
  toolName: ToolAgentToolName;
  title: string;
  inputJson?: Record<string, unknown>;
};

export type ToolResult = {
  toolName: ToolAgentToolName;
  status: ToolInvocationStatus;
  outputJson?: Record<string, unknown>;
  errorMessage?: string;
};
