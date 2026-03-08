export async function runVentureAutopilotLoopJob(input: {
  opportunityName: string;
}) {
  return {
    opportunityName: input.opportunityName,
    status: "completed",
    loopExecuted: true
  };
}
