export async function runExperimentAnalysisJob(input: {
  experimentId: string;
}) {
  return {
    experimentId: input.experimentId,
    status: "completed",
    analyzed: true
  };
}
