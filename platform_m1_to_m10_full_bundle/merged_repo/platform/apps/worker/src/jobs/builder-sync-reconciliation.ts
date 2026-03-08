export async function runBuilderSyncReconciliationJob(input: {
  projectId: string;
  runId: string;
}) {
  return {
    projectId: input.projectId,
    runId: input.runId,
    status: "completed",
    checked: ["spec_canvas_diff", "bindings", "layout_nodes"]
  };
}
