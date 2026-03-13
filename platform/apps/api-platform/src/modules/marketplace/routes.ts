import { randomUUID } from "crypto";
import { Express } from "express";
import {
  templateDefinitionsRepository,
  templateInstallationsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireOrgRole } from "../../middleware/requireOrgRole";
import { validateBody } from "../../validators/common";
import {
  installTemplateSchema,
  publishTemplateSchema
} from "../../validators/template-marketplace.dto";
import {
  publishTemplateVersionSchema,
  rateTemplateSchema
} from "../../validators/template-marketplace-v2.dto";
import { installMarketplaceTemplate, seedBuiltInMarketplaceTemplates } from "../../services/templateMarketplace";
import {
  getTemplateAnalytics,
  publishTemplateVersion,
  rateTemplate,
  searchTemplates,
  upgradeTemplateInstallation
} from "../../services/templateMarketplaceV2";
import { writeAuditLog } from "../../utils/audit";

export function registerMarketplaceRoutes(app: Express): void {
  app.get("/api/marketplace/templates", requireAuth, async (_req, res) => {
    await seedBuiltInMarketplaceTemplates();
    const templates = await templateDefinitionsRepository.listPublished();
    res.json(templates);
  });

  app.get("/api/marketplace/templates/search", requireAuth, async (req, res) => {
    const templates = await searchTemplates({
      query: typeof req.query.q === "string" ? req.query.q : undefined,
      category: typeof req.query.category === "string" ? req.query.category : undefined,
      tags: typeof req.query.tags === "string" ? req.query.tags.split(",").filter(Boolean) : undefined
    });
    res.json(templates);
  });

  app.get("/api/marketplace/templates/category/:category", requireAuth, async (req, res) => {
    await seedBuiltInMarketplaceTemplates();
    const templates = await templateDefinitionsRepository.listByCategory(req.params.category);
    res.json(templates);
  });

  app.get("/api/marketplace/templates/:id/analytics", requireAuth, async (req, res) => {
    const analytics = await getTemplateAnalytics(req.params.id);
    res.json(analytics);
  });

  app.get("/api/organizations/:id/template-installations", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const installations = await templateInstallationsRepository.listForOrganization(req.params.id);
    res.json(installations);
  });

  app.post("/api/organizations/:id/marketplace/install", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(installTemplateSchema), async (req, res) => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await installMarketplaceTemplate({
      organizationId: req.params.id,
      templateKey: req.body.templateKey,
      createdByUserId: req.user.id,
      projectName: req.body.projectName,
      projectDescription: req.body.projectDescription
    });

    await writeAuditLog({
      actorUserId: req.user.id,
      organizationId: req.params.id,
      projectId: result.project.id,
      action: "marketplace.template.install",
      entityType: "TemplateInstallation",
      entityId: result.installation.id,
      metadataJson: { templateKey: req.body.templateKey }
    });

    res.status(201).json(result);
  });

  app.post("/api/marketplace/templates/publish", requireAuth, validateBody(publishTemplateSchema), async (req, res) => {
    const template = await templateDefinitionsRepository.create({
      id: randomUUID(),
      key: req.body.key,
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description || null,
      category: req.body.category,
      version: req.body.version,
      thumbnailUrl: req.body.thumbnailUrl || null,
      templateSpecJson: req.body.templateSpecJson,
      tagsJson: req.body.tagsJson,
      isPublished: true
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "marketplace.template.publish",
      entityType: "TemplateDefinition",
      entityId: template.id,
      metadataJson: { key: template.key }
    });

    res.status(201).json(template);
  });

  app.post("/api/marketplace/templates/version", requireAuth, validateBody(publishTemplateVersionSchema), async (req, res) => {
    const version = await publishTemplateVersion(req.body);

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "marketplace.template.version.publish",
      entityType: "TemplateMarketplaceVersion",
      entityId: version.id
    });

    res.status(201).json(version);
  });

  app.post("/api/marketplace/templates/:id/rate", requireAuth, validateBody(rateTemplateSchema), async (req, res) => {
    const rating = await rateTemplate({
      templateDefinitionId: req.params.id,
      userId: req.user?.id,
      rating: req.body.rating,
      review: req.body.review
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "marketplace.template.rate",
      entityType: "TemplateRating",
      entityId: rating.id
    });

    res.status(201).json(rating);
  });

  app.post("/api/marketplace/installations/:id/upgrade", requireAuth, async (req, res) => {
    const result = await upgradeTemplateInstallation({
      installationId: req.params.id,
      templateDefinitionId: String(req.body?.templateDefinitionId || "")
    });
    res.json(result);
  });
}
