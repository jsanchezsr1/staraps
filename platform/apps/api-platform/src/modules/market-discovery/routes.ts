import { Express } from "express";
import {
  marketSignalsRepository,
  opportunityClustersRepository,
  opportunityScoresRepository,
  trendSourcesRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { scanMarketDiscoverySchema } from "../../validators/market-discovery.dto";
import { runMarketScan, seedTrendSources } from "../../services/marketDiscovery";

export function registerMarketDiscoveryRoutes(app: Express): void {
  app.get("/api/market-discovery/sources", requireAuth, async (_req, res) => {
    await seedTrendSources();
    const items = await trendSourcesRepository.listAll();
    res.json(items);
  });

  app.get("/api/market-discovery/signals", requireAuth, async (_req, res) => {
    const items = await marketSignalsRepository.listAll();
    res.json(items);
  });

  app.get("/api/market-discovery/clusters", requireAuth, async (_req, res) => {
    const items = await opportunityClustersRepository.listAll();
    res.json(items);
  });

  app.get("/api/market-discovery/scores", requireAuth, async (_req, res) => {
    const items = await opportunityScoresRepository.listAll();
    res.json(items);
  });

  app.post("/api/market-discovery/scan", requireAuth, validateBody(scanMarketDiscoverySchema), async (req, res) => {
    const result = await runMarketScan({
      projectId: req.body.projectId,
      seedKeywords: req.body.seedKeywords
    });
    res.status(201).json(result);
  });
}
