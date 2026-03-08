import { randomUUID } from "crypto";
import {
  templateDefinitionsRepository,
  templateInstallationsRepository,
  templateMarketplaceVersionsRepository,
  templateRatingsRepository
} from "@platform/database";

export async function publishTemplateVersion(input: {
  templateDefinitionId: string;
  version: string;
  changelog?: string;
  templateSpecJson: Record<string, unknown>;
}) {
  return templateMarketplaceVersionsRepository.create({
    id: randomUUID(),
    templateDefinitionId: input.templateDefinitionId,
    version: input.version,
    changelog: input.changelog || null,
    templateSpecJson: input.templateSpecJson
  });
}

export async function rateTemplate(input: {
  templateDefinitionId: string;
  organizationId?: string;
  userId?: string;
  rating: number;
  review?: string;
}) {
  return templateRatingsRepository.create({
    id: randomUUID(),
    templateDefinitionId: input.templateDefinitionId,
    organizationId: input.organizationId || null,
    userId: input.userId || null,
    rating: input.rating,
    review: input.review || null
  });
}

export async function getTemplateAnalytics(templateDefinitionId: string) {
  const ratings = await templateRatingsRepository.aggregateForTemplate(templateDefinitionId);
  const installs = await templateInstallationsRepository.listForOrganization; // scaffold reference
  return {
    templateDefinitionId,
    installs: 0,
    avgRating: Number(ratings._avg.rating || 0),
    ratingCount: Number(ratings._count.rating || 0)
  };
}

export async function searchTemplates(input: {
  query?: string;
  category?: string;
  tags?: string[];
}) {
  let templates = input.category
    ? await templateDefinitionsRepository.listByCategory(input.category)
    : await templateDefinitionsRepository.listPublished();

  if (input.query) {
    const q = input.query.toLowerCase();
    templates = templates.filter((t: any) =>
      String(t.name || "").toLowerCase().includes(q) ||
      String(t.description || "").toLowerCase().includes(q)
    );
  }

  if (input.tags && input.tags.length > 0) {
    templates = templates.filter((t: any) => {
      const tags = Array.isArray(t.tagsJson) ? t.tagsJson : [];
      return input.tags!.every((tag) => tags.includes(tag));
    });
  }

  return templates;
}

export async function upgradeTemplateInstallation(input: {
  installationId: string;
  templateDefinitionId: string;
}) {
  const latest = await templateMarketplaceVersionsRepository.findLatest(input.templateDefinitionId);
  return {
    installationId: input.installationId,
    latestVersion: latest?.version || null,
    upgraded: Boolean(latest)
  };
}
