import { LLMAdapter } from "./llm/adapter";
import { SYSTEM_PROMPT } from "./prompts/systemPrompt";
import { parseGeneratedSpec } from "./parser/parseSpec";

export async function generateSpecFromPrompt(
  adapter: LLMAdapter,
  prompt: string
) {
  const completion = await adapter.complete({
    system: SYSTEM_PROMPT,
    prompt
  });

  const spec = parseGeneratedSpec(completion.text);

  return spec;
}
