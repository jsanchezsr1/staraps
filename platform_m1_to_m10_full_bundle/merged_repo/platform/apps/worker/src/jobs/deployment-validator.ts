export async function runDeploymentValidatorJob(input: {
  deploymentRunId: string;
  url?: string;
}) {
  return {
    deploymentRunId: input.deploymentRunId,
    url: input.url || null,
    valid: true
  };
}
