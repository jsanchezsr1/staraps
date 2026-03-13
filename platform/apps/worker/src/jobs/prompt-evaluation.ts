export async function runPromptEvaluationJob(input: {
  promptVersionId: string;
}) {
  return {
    promptVersionId: input.promptVersionId,
    status: "completed",
    evaluated: true
  };
}
