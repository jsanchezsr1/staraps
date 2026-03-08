export async function runProductEvolutionJob(input: {
  projectId: string;
  iterationRunId: string;
}) {
  return {
    projectId: input.projectId,
    iterationRunId: input.iterationRunId,
    status: "completed",
    evolved: true
  };
}
