export async function runInsightAnalysisJob(input: {
  projectId: string;
}) {
  return {
    projectId: input.projectId,
    status: "completed",
    analyzed: true
  };
}
