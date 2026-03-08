export async function runVentureCreationJob(input: { opportunityName: string }) {
  return {
    opportunityName: input.opportunityName,
    status: "completed",
    created: true
  };
}
