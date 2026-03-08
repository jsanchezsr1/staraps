import type { CopilotMessage } from "./types";

export async function runCopilotChat(input: {
  projectId: string;
  messages: CopilotMessage[];
}) {
  const last = input.messages[input.messages.length - 1];
  return {
    reply: `Copilot response for project ${input.projectId}: ${last?.content || ""}`.trim()
  };
}
