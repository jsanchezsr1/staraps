export async function runVentureBuildJob(input: { ventureName: string }) {
  return {
    ventureName: input.ventureName,
    status: "completed",
    built: true
  };
}
