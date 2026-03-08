import { draftSpecFromPrompt } from "./aiSpecDraft";

export type AiDraftRequest = {
  prompt: string;
  nameHint?: string;
  provider?: "rule-based" | "openai";
};

export async function generateAiSpecDraft(input: AiDraftRequest) {
  switch (input.provider || "rule-based") {
    case "openai":
      return draftUsingOpenAiStub(input);
    case "rule-based":
    default:
      return draftSpecFromPrompt({
        prompt: input.prompt,
        nameHint: input.nameHint
      });
  }
}

async function draftUsingOpenAiStub(input: AiDraftRequest) {
  return {
    ...(draftSpecFromPrompt({ prompt: input.prompt, nameHint: input.nameHint })),
    meta: {
      ...(draftSpecFromPrompt({ prompt: input.prompt, nameHint: input.nameHint }).meta),
      description: `[AI provider stub: openai] ${input.prompt.slice(0, 200)}`
    }
  };
}
