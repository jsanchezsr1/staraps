import { randomUUID } from "crypto";
import { clusterMarketSignals, scanMarketSignals, scoreOpportunityClusters } from "@platform/market-discovery";
import {
  marketSignalsRepository,
  opportunityClustersRepository,
  opportunityScoresRepository,
  trendSourcesRepository
} from "@platform/database";

export async function seedTrendSources() {
  const items = [
    ["google_trends", "Google Trends"],
    ["reddit", "Reddit"],
    ["github", "GitHub"],
    ["product_hunt", "Product Hunt"],
    ["hacker_news", "Hacker News"],
    ["x", "X / Twitter"],
    ["app_store", "App Store"]
  ];

  for (const [sourceType, displayName] of items) {
    await trendSourcesRepository.upsert({
      id: randomUUID(),
      sourceType,
      displayName,
      isEnabled: true
    });
  }
}

export async function runMarketScan(input: {
  projectId?: string;
  seedKeywords?: string[];
}) {
  await seedTrendSources();

  const sources = await trendSourcesRepository.listAll();
  const sourceMap = new Map(sources.map((s: any) => [s.sourceType, s.id]));

  const signals = await scanMarketSignals({
    seedKeywords: input.seedKeywords
  });

  const signalRecords = []
  for (const signal of signals) {
    const rec = await marketSignalsRepository.create({
      id: randomUUID(),
      projectId: input.projectId || null,
      trendSourceId: sourceMap.get(signal.sourceType) || null,
      keyword: signal.keyword,
      title: signal.title,
      description: signal.description,
      strength: signal.strength,
      payloadJson: signal.payloadJson || null
    });
    signalRecords.push(rec);
  }

  const clusters = await clusterMarketSignals({ signals });

  const clusterRecords = []
  for (const cluster of clusters) {
    const rec = await opportunityClustersRepository.create({
      id: randomUUID(),
      projectId: input.projectId || null,
      name: cluster.name,
      description: cluster.description,
      keywordsJson: cluster.keywords
    });
    clusterRecords.push(rec);
  }

  const scores = await scoreOpportunityClusters({ clusters });

  const scoreRecords = []
  for (let idx = 0; idx < scores.length; idx++) {
    const score = scores[idx]
    const rec = await opportunityScoresRepository.create({
      id: randomUUID(),
      opportunityClusterId: clusterRecords[idx].id,
      demandScore: score.demandScore,
      competitionScore: score.competitionScore,
      opportunityScore: score.opportunityScore,
      summary: score.summary
    });
    scoreRecords.push(rec);
  }

  return {
    signals: signalRecords,
    clusters: clusterRecords,
    scores: scoreRecords
  };
}
