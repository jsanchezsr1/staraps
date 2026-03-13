import type { ModelProviderDefinition } from "./types";

export function getDefaultModelProviders(): ModelProviderDefinition[] {
  return [
    {
      name: "openai",
      displayName: "OpenAI",
      isEnabled: true,
      models: ["gpt-4o", "gpt-4o-mini"]
    },
    {
      name: "anthropic",
      displayName: "Anthropic",
      isEnabled: true,
      models: ["claude-sonnet", "claude-haiku"]
    },
    {
      name: "google",
      displayName: "Google",
      isEnabled: true,
      models: ["gemini-pro", "gemini-flash"]
    }
  ];
}
