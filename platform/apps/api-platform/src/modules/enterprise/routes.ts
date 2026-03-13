import { Express } from "express";
import {
  environmentPromotionsRepository,
  organizationSsoConfigRepository,
  projectApprovalRequestsRepository,
  scimProvisioningRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireOrgRole } from "../../middleware/requireOrgRole";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import {
  createApprovalRequestSchema,
  createEnvironmentPromotionSchema,
  upsertScimConfigSchema,
  upsertSsoConfigSchema
} from "../../validators/enterprise.dto";
import {
  approveApprovalRequest,
  approveEnvironmentPromotion,
  createApprovalRequest,
  createEnvironmentPromotion,
  upsertOrganizationSsoConfig,
  upsertScimConfig
} from "../../services/enterprise";
import { writeAuditLog } from "../../utils/audit";

export function registerEnterpriseRoutes(app: Express): void {
  app.get("/api/organizations/:id/enterprise/sso", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), async (req, res) => {
    const config = await organizationSsoConfigRepository.findByOrganizationId(req.params.id);
    res.json(config);
  });

  app.post("/api/organizations/:id/enterprise/sso", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), validateBody(upsertSsoConfigSchema), async (req, res) => {
    const config = await upsertOrganizationSsoConfig({
      organizationId: req.params.id,
      ...req.body
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      organizationId: req.params.id,
      action: "enterprise.sso.upsert",
      entityType: "OrganizationSSOConfig",
      entityId: config.id
    });

    res.status(201).json(config);
  });

  app.get("/api/organizations/:id/enterprise/scim", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), async (req, res) => {
    const events = await scimProvisioningRepository.listEvents(req.params.id);
    res.json(events);
  });

  app.post("/api/organizations/:id/enterprise/scim", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), validateBody(upsertScimConfigSchema), async (req, res) => {
    const config = await upsertScimConfig({
      organizationId: req.params.id,
      ...req.body
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      organizationId: req.params.id,
      action: "enterprise.scim.upsert",
      entityType: "ScimProvisioningConfig",
      entityId: config.id
    });

    res.status(201).json(config);
  });

  app.get("/api/projects/:id/enterprise/promotions", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const items = await environmentPromotionsRepository.listByProject(req.params.id);
    res.json(items);
  });

  app.post("/api/projects/:id/enterprise/promotions", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createEnvironmentPromotionSchema), async (req, res) => {
    const item = await createEnvironmentPromotion({
      projectId: req.params.id,
      requestedByUserId: req.user?.id,
      ...req.body
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "enterprise.promotion.create",
      entityType: "EnvironmentPromotion",
      entityId: item.id
    });

    res.status(201).json(item);
  });

  app.post("/api/projects/:id/enterprise/promotions/:promotionId/approve", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), async (req, res) => {
    const item = await approveEnvironmentPromotion({
      id: req.params.promotionId,
      approvedByUserId: req.user?.id
    });
    res.json(item);
  });

  app.get("/api/projects/:id/enterprise/approvals", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const items = await projectApprovalRequestsRepository.listByProject(req.params.id);
    res.json(items);
  });

  app.post("/api/projects/:id/enterprise/approvals", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createApprovalRequestSchema), async (req, res) => {
    const item = await createApprovalRequest({
      projectId: req.params.id,
      requestedByUserId: req.user?.id,
      ...req.body
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "enterprise.approval_request.create",
      entityType: "ProjectApprovalRequest",
      entityId: item.id
    });

    res.status(201).json(item);
  });

  app.post("/api/projects/:id/enterprise/approvals/:approvalId/approve", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), async (req, res) => {
    const item = await approveApprovalRequest({
      id: req.params.approvalId,
      approvedByUserId: req.user?.id
    });
    res.json(item);
  });
}
