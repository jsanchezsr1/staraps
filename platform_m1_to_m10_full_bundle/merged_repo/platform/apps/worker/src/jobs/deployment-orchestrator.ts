export async function runDeploymentOrchestratorJob(input: {
  projectId: string;
  deploymentRunId: string;
}) {
  return {
    projectId: input.projectId,
    deploymentRunId: input.deploymentRunId,
    status: "completed",
    deployed: true
  };
}
