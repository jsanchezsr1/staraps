import { runCopilotChat, suggestSpecImprovements, suggestGenerationFixes, explainDiagnostics } from "@platform/copilot";

export async function runProjectCopilotChat(input: {
  projectId: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
}) {
  return runCopilotChat(input);
}

export async function runProjectSpecSuggestions(input: {
  projectId: string;
  specJson?: Record<string, unknown>;
}) {
  return suggestSpecImprovements(input);
}

export async function runProjectGenerationFixes(input: {
  projectId: string;
  diagnostics?: string[];
}) {
  return suggestGenerationFixes(input);
}

export async function runProjectDiagnosticExplanation(input: {
  projectId: string;
  diagnostics?: string[];
}) {
  return explainDiagnostics(input);
}
