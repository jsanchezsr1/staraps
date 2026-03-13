export async function executeDeploymentRollback(input: {
  deploymentRunId: string;
  reason?: string;
}) {
  return {
    deploymentRunId: input.deploymentRunId,
    status: "rolled_back",
    reason: input.reason || "manual rollback"
  };
}
