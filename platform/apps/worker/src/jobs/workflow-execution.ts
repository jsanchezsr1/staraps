export async function runWorkflowExecutionJob(input: {
  workflowExecutionId: string;
}) {
  return {
    workflowExecutionId: input.workflowExecutionId,
    status: "completed"
  };
}
