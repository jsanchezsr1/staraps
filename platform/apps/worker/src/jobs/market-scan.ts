export async function runMarketScanJob(input: {
  seedKeywords?: string[];
}) {
  return {
    seedKeywords: input.seedKeywords || [],
    status: "completed",
    scanned: true
  };
}
