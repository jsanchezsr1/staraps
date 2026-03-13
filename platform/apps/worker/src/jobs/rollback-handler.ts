export async function runRollbackHandlerJob(input: {
  deploymentRunId: string;
  reason?: string;
}) {
  return {
    deploymentRunId: input.deploymentRunId,
    reason: input.reason || "manual rollback",
    rolledBack: true
  };
}
