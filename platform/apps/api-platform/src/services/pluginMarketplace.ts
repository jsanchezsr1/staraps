import { randomUUID } from "crypto";
import {
  pluginDevelopersRepository,
  pluginMarketplaceItemsRepository,
  pluginMarketplaceVersionsRepository,
  pluginMarketplaceRatingsRepository,
  pluginInstallationsRepository
} from "@platform/database";

export async function createPluginDeveloper(input: {
  userId?: string;
  organizationId?: string;
  displayName: string;
  slug: string;
  bio?: string;
  websiteUrl?: string;
}) {
  return pluginDevelopersRepository.create({
    id: randomUUID(),
    userId: input.userId || null,
    organizationId: input.organizationId || null,
    displayName: input.displayName,
    slug: input.slug,
    bio: input.bio || null,
    websiteUrl: input.websiteUrl || null
  });
}

export async function publishPlugin(input: {
  developerId: string;
  key: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  permissionsJson: string[];
  manifestJson: Record<string, unknown>;
  thumbnailUrl?: string;
}) {
  return pluginMarketplaceItemsRepository.create({
    id: randomUUID(),
    developerId: input.developerId,
    key: input.key,
    name: input.name,
    slug: input.slug,
    category: input.category,
    description: input.description || null,
    permissionsJson: input.permissionsJson,
    manifestJson: input.manifestJson,
    thumbnailUrl: input.thumbnailUrl || null,
    isPublished: true
  });
}

export async function publishPluginVersion(input: {
  pluginMarketplaceItemId: string;
  version: string;
  changelog?: string;
  packageUrl?: string;
  manifestJson: Record<string, unknown>;
}) {
  return pluginMarketplaceVersionsRepository.create({
    id: randomUUID(),
    pluginMarketplaceItemId: input.pluginMarketplaceItemId,
    version: input.version,
    changelog: input.changelog || null,
    packageUrl: input.packageUrl || null,
    manifestJson: input.manifestJson
  });
}

export async function ratePlugin(input: {
  pluginMarketplaceItemId: string;
  organizationId?: string;
  userId?: string;
  rating: number;
  review?: string;
}) {
  return pluginMarketplaceRatingsRepository.create({
    id: randomUUID(),
    pluginMarketplaceItemId: input.pluginMarketplaceItemId,
    organizationId: input.organizationId || null,
    userId: input.userId || null,
    rating: input.rating,
    review: input.review || null
  });
}

export async function searchPlugins(input: {
  query?: string;
  category?: string;
  tags?: string[];
}) {
  let items = input.category
    ? await pluginMarketplaceItemsRepository.listByCategory(input.category)
    : await pluginMarketplaceItemsRepository.listPublished();

  if (input.query) {
    const q = input.query.toLowerCase()
    items = items.filter((item: any) =>
      String(item.name || "").toLowerCase().includes(q) ||
      String(item.description || "").toLowerCase().includes(q)
    )
  }

  if (input.tags && input.tags.length > 0) {
    items = items.filter((item: any) => {
      const tags = Array.isArray(item.manifestJson?.tags) ? item.manifestJson.tags : [];
      return input.tags!.every((tag) => tags.includes(tag));
    });
  }

  return items;
}

export async function getPluginAnalytics(pluginMarketplaceItemId: string) {
  const ratings = await pluginMarketplaceRatingsRepository.aggregateForItem(pluginMarketplaceItemId);
  return {
    pluginMarketplaceItemId,
    installs: 0,
    avgRating: Number(ratings._avg.rating || 0),
    ratingCount: Number(ratings._count.rating || 0)
  };
}

export async function installMarketplacePlugin(input: {
  organizationId: string;
  pluginKey: string;
  configJson?: Record<string, unknown>;
}) {
  const plugin = await pluginMarketplaceItemsRepository.findByKey(input.pluginKey);
  if (!plugin) throw new Error("Plugin not found");

  return pluginInstallationsRepository.install({
    id: randomUUID(),
    organizationId: input.organizationId,
    pluginKey: plugin.key,
    enabled: true,
    configJson: input.configJson || null
  });
}

export async function upgradeMarketplacePlugin(input: {
  installationId: string;
  pluginMarketplaceItemId: string;
}) {
  const latest = await pluginMarketplaceVersionsRepository.findLatest(input.pluginMarketplaceItemId);
  return {
    installationId: input.installationId,
    latestVersion: latest?.version || null,
    upgraded: Boolean(latest)
  };
}
