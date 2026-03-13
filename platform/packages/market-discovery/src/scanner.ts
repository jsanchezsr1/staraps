import type { MarketSignal, OpportunityCluster, OpportunityScore } from "./types";

export async function scanMarketSignals(input: {
  seedKeywords?: string[];
}) : Promise<MarketSignal[]> {
  const seeds = input.seedKeywords?.length ? input.seedKeywords : ["ai agents", "workflow automation", "saas analytics"];
  return seeds.map((keyword, idx) => ({
    sourceType: idx % 2 === 0 ? "google_trends" : "reddit",
    keyword,
    title: `Signal for ${keyword}`,
    description: `Growing discussion and search interest detected for ${keyword}.`,
    strength: idx === 0 ? "high" : "medium",
    payloadJson: { seed: keyword }
  }));
}

export async function clusterMarketSignals(input: {
  signals: MarketSignal[];
}) : Promise<OpportunityCluster[]> {
  return input.signals.map((signal) => ({
    name: `${signal.keyword} opportunity`,
    description: `Opportunity cluster derived from ${signal.keyword}.`,
    keywords: [signal.keyword]
  }));
}

export async function scoreOpportunityClusters(input: {
  clusters: OpportunityCluster[];
}) : Promise<OpportunityScore[]> {
  return input.clusters.map((cluster, idx) => ({
    clusterName: cluster.name,
    demandScore: 70 + idx,
    competitionScore: 40 + idx,
    opportunityScore: 80 - idx,
    summary: `Cluster ${cluster.name} shows favorable demand relative to competition.`
  }));
}
