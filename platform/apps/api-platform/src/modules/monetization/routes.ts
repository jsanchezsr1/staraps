import { Express } from "express";
import {
  developerBalanceRepository,
  marketplacePayoutsRepository,
  marketplaceRevenueShareRepository,
  marketplaceTransactionsRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import {
  purchasePluginSchema,
  purchaseTemplateSchema,
  requestPayoutSchema
} from "../../validators/monetization.dto";
import {
  purchasePlugin,
  purchaseTemplate,
  requestDeveloperPayout
} from "../../services/monetization";
import { writeAuditLog } from "../../utils/audit";

export function registerMonetizationRoutes(app: Express): void {
  app.post("/api/marketplace/purchase/template", requireAuth, validateBody(purchaseTemplateSchema), async (req, res) => {
    const tx = await purchaseTemplate({
      organizationId: req.user?.organizationId,
      buyerUserId: req.user?.id,
      templateDefinitionId: req.body.templateDefinitionId,
      amountCents: req.body.amountCents,
      currency: req.body.currency,
      provider: req.body.provider
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      organizationId: req.user?.organizationId,
      action: "monetization.purchase.template",
      entityType: "MarketplaceTransaction",
      entityId: tx.id
    });

    res.status(201).json(tx);
  });

  app.post("/api/marketplace/purchase/plugin", requireAuth, validateBody(purchasePluginSchema), async (req, res) => {
    const tx = await purchasePlugin({
      organizationId: req.user?.organizationId,
      buyerUserId: req.user?.id,
      pluginMarketplaceItemId: req.body.pluginMarketplaceItemId,
      developerId: req.body.developerId,
      amountCents: req.body.amountCents,
      currency: req.body.currency,
      provider: req.body.provider
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      organizationId: req.user?.organizationId,
      action: "monetization.purchase.plugin",
      entityType: "MarketplaceTransaction",
      entityId: tx.id
    });

    res.status(201).json(tx);
  });

  app.get("/api/developers/:id/earnings", requireAuth, async (req, res) => {
    const balance = await developerBalanceRepository.findByDeveloper(req.params.id);
    const shares = await marketplaceRevenueShareRepository.listByDeveloper(req.params.id);
    const payouts = await marketplacePayoutsRepository.listByDeveloper(req.params.id);
    res.json({ balance, shares, payouts });
  });

  app.post("/api/developers/:id/payouts", requireAuth, validateBody(requestPayoutSchema), async (req, res) => {
    const payout = await requestDeveloperPayout({
      developerId: req.params.id,
      amountCents: req.body.amountCents,
      currency: req.body.currency,
      provider: req.body.provider
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "monetization.payout.request",
      entityType: "MarketplacePayout",
      entityId: payout.id
    });

    res.status(201).json(payout);
  });

  app.get("/api/organizations/:id/marketplace/transactions", requireAuth, async (req, res) => {
    const tx = await marketplaceTransactionsRepository.listByOrganization(req.params.id);
    res.json(tx);
  });
}
