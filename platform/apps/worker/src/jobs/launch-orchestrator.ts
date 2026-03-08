export async function runLaunchOrchestratorJob(input: { productName: string }) {
  return {
    productName: input.productName,
    status: "completed",
    launched: true
  };
}
