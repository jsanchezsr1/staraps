export async function runSelfHealingJob(input: {
  projectId: string;
  repairRunId: string;
}) {
  return {
    projectId: input.projectId,
    repairRunId: input.repairRunId,
    status: "completed",
    repaired: true
  };
}
