import type { PromptTemplateDefinition } from "./types";

export async function createInitialPromptVersion(input: {
  template: PromptTemplateDefinition;
}) {
  return {
    version: 1,
    body: input.template.body,
    changelog: "Initial version"
  };
}
