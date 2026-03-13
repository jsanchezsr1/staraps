export type LLMCompletionInput = {
  prompt: string;
  system?: string;
  temperature?: number;
};

export type LLMCompletionOutput = {
  text: string;
};

export interface LLMAdapter {
  complete(input: LLMCompletionInput): Promise<LLMCompletionOutput>;
}
