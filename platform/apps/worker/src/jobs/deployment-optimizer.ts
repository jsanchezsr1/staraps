export async function runDeploymentOptimizerJob(input: {
  deploymentRunId: string;
}) {
  return {
    deploymentRunId: input.deploymentRunId,
    optimized: true
  };
}
