import { Express } from "express";
import {
  organizationSubscriptionsRepository,
  planDefinitionsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireOrgRole } from "../../middleware/requireOrgRole";
import { validateBody } from "../../validators/common";
import { assignPlanSchema } from "../../validators/billing.dto";
import { assignOrganizationPlan, ensurePlansSeeded, getOrganizationUsage } from "../../services/billing";
import { writeAuditLog } from "../../utils/audit";

export function registerBillingRoutes(app: Express): void {
  app.get("/api/billing/plans", requireAuth, async (_req, res) => {
    await ensurePlansSeeded();
    const plans = await planDefinitionsRepository.listActive();
    res.json(plans);
  });

  app.get("/api/organizations/:id/subscription", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const subscription = await organizationSubscriptionsRepository.findByOrganizationId(req.params.id);
    res.json(subscription);
  });

  app.post("/api/organizations/:id/subscription", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), validateBody(assignPlanSchema), async (req, res) => {
    const subscription = await assignOrganizationPlan({
      organizationId: req.params.id,
      planKey: req.body.planKey,
      status: req.body.status,
      billingProvider: req.body.billingProvider
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      organizationId: req.params.id,
      action: "billing.subscription.assign",
      entityType: "OrganizationSubscription",
      entityId: subscription.id,
      metadataJson: req.body
    });

    res.status(201).json(subscription);
  });

  app.get("/api/organizations/:id/usage", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const usage = await getOrganizationUsage(req.params.id);
    res.json(usage);
  });
}
