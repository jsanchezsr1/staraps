import { Express } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import {
  createPluginDeveloperSchema,
  publishPluginSchema,
  publishPluginVersionSchema,
  ratePluginSchema
} from "../../validators/plugin-marketplace.dto";
import {
  createPluginDeveloper,
  publishPlugin,
  publishPluginVersion,
  ratePlugin,
  searchPlugins,
  getPluginAnalytics,
  installMarketplacePlugin,
  upgradeMarketplacePlugin
} from "../../services/pluginMarketplace";
import { writeAuditLog } from "../../utils/audit";

export function registerPluginMarketplaceRoutes(app: Express): void {
  app.get("/api/plugins/marketplace", requireAuth, async (_req, res) => {
    const items = await searchPlugins({});
    res.json(items);
  });

  app.get("/api/plugins/marketplace/search", requireAuth, async (req, res) => {
    const items = await searchPlugins({
      query: typeof req.query.q === "string" ? req.query.q : undefined,
      category: typeof req.query.category === "string" ? req.query.category : undefined,
      tags: typeof req.query.tags === "string" ? req.query.tags.split(",").filter(Boolean) : undefined
    });
    res.json(items);
  });

  app.get("/api/plugins/marketplace/:id/analytics", requireAuth, async (req, res) => {
    const analytics = await getPluginAnalytics(req.params.id);
    res.json(analytics);
  });

  app.post("/api/plugins/developers", requireAuth, validateBody(createPluginDeveloperSchema), async (req, res) => {
    const developer = await createPluginDeveloper({
      userId: req.user?.id,
      displayName: req.body.displayName,
      slug: req.body.slug,
      bio: req.body.bio,
      websiteUrl: req.body.websiteUrl
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "plugins.developer.create",
      entityType: "PluginDeveloper",
      entityId: developer.id
    });

    res.status(201).json(developer);
  });

  app.post("/api/plugins/marketplace/publish", requireAuth, validateBody(publishPluginSchema), async (req, res) => {
    const item = await publishPlugin(req.body);

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "plugins.marketplace.publish",
      entityType: "PluginMarketplaceItem",
      entityId: item.id
    });

    res.status(201).json(item);
  });

  app.post("/api/plugins/marketplace/version", requireAuth, validateBody(publishPluginVersionSchema), async (req, res) => {
    const version = await publishPluginVersion(req.body);

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "plugins.marketplace.version.publish",
      entityType: "PluginMarketplaceVersion",
      entityId: version.id
    });

    res.status(201).json(version);
  });

  app.post("/api/plugins/marketplace/:id/rate", requireAuth, validateBody(ratePluginSchema), async (req, res) => {
    const rating = await ratePlugin({
      pluginMarketplaceItemId: req.params.id,
      userId: req.user?.id,
      rating: req.body.rating,
      review: req.body.review
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "plugins.marketplace.rate",
      entityType: "PluginMarketplaceRating",
      entityId: rating.id
    });

    res.status(201).json(rating);
  });

  app.post("/api/plugins/marketplace/install", requireAuth, async (req, res) => {
    const installation = await installMarketplacePlugin({
      organizationId: String(req.body?.organizationId || ""),
      pluginKey: String(req.body?.pluginKey || ""),
      configJson: req.body?.configJson || null
    });
    res.status(201).json(installation);
  });

  app.post("/api/plugins/installations/:id/upgrade", requireAuth, async (req, res) => {
    const result = await upgradeMarketplacePlugin({
      installationId: req.params.id,
      pluginMarketplaceItemId: String(req.body?.pluginMarketplaceItemId || "")
    });
    res.json(result);
  });
}
