import { Express } from "express";
import {
  portfolioCompaniesRepository,
  portfolioInterventionsRepository,
  portfolioKpiSnapshotsRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { createPortfolioCompanySchema } from "../../validators/portfolio-ops.dto";
import { createPortfolioCompany, reviewCompany } from "../../services/portfolioOps";

export function registerPortfolioOpsRoutes(app: Express): void {
  app.get("/api/portfolio/companies", requireAuth, async (_req, res) => {
    const items = await portfolioCompaniesRepository.listAll();
    res.json(items);
  });

  app.post("/api/portfolio/companies", requireAuth, validateBody(createPortfolioCompanySchema), async (req, res) => {
    const item = await createPortfolioCompany({
      venturePortfolioEntryId: req.body.venturePortfolioEntryId,
      name: req.body.name,
      status: req.body.status,
      summary: req.body.summary
    });
    res.status(201).json(item);
  });

  app.get("/api/portfolio/companies/:id", requireAuth, async (req, res) => {
    const company = await portfolioCompaniesRepository.findById(req.params.id);
    if (!company) {
      res.status(404).json({ message: "Portfolio company not found" });
      return;
    }
    const kpis = await portfolioKpiSnapshotsRepository.listByCompany(req.params.id);
    const interventions = await portfolioInterventionsRepository.listByCompany(req.params.id);
    res.json({ company, kpis, interventions });
  });

  app.post("/api/portfolio/companies/:id/review", requireAuth, async (req, res) => {
    const item = await reviewCompany({
      portfolioCompanyId: req.params.id
    });
    res.json(item);
  });
}
