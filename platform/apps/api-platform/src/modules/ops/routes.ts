import { Express } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { makeHealthReport } from "@platform/shared/health";
import { readCounters } from "@platform/shared/metrics";
import { queueTopology } from "../../services/queueTopology";

export function registerOpsRoutes(app: Express): void {
  app.get("/api/ops/health", requireAuth, async (_req, res) => {
    res.json(makeHealthReport({
      service: "api-platform",
      status: "ok",
      checks: [
        { name: "http", status: "ok" },
        { name: "routes", status: "ok" }
      ]
    }));
  });

  app.get("/api/ops/metrics", requireAuth, async (_req, res) => {
    res.json({
      counters: readCounters(),
      queues: queueTopology
    });
  });
}
