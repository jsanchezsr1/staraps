import { generateSpecFromPrompt } from "@platform/ai-builder";
import { OpenAIAdapter } from "@platform/ai-builder/dist/llm/openaiAdapter";

const adapter = new OpenAIAdapter();

export async function generateAppSpec(prompt: string) {
  const spec = await generateSpecFromPrompt(adapter, prompt);
  return spec;
}
