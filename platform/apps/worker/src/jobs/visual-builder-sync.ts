export async function runVisualBuilderSyncJob(input: {
  projectId: string;
  reason: string;
}) {
  return {
    projectId: input.projectId,
    reason: input.reason,
    status: "completed"
  };
}
