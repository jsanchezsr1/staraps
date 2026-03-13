import { randomUUID } from "crypto";
import {
  projectsRepository,
  projectVersionsRepository,
  templateDefinitionsRepository,
  templateInstallationsRepository
} from "@platform/database";
import { slugify } from "@platform/shared";
import { getMarketplaceTemplateByKey, listMarketplaceTemplates } from "@platform/plugins/templateMarketplace";

export async function seedBuiltInMarketplaceTemplates() {
  const builtIns = listMarketplaceTemplates();
  for (const template of builtIns) {
    const existing = await templateDefinitionsRepository.findByKey(template.key);
    if (!existing) {
      await templateDefinitionsRepository.create({
        id: randomUUID(),
        key: template.key,
        name: template.name,
        slug: template.slug,
        description: template.description,
        category: template.category,
        version: template.version,
        thumbnailUrl: template.thumbnailUrl || null,
        templateSpecJson: template.templateSpecJson,
        tagsJson: template.tags,
        isPublished: true
      });
    }
  }
}

export async function installMarketplaceTemplate(input: {
  organizationId: string;
  templateKey: string;
  createdByUserId: string;
  projectName?: string;
  projectDescription?: string;
}) {
  let template = await templateDefinitionsRepository.findByKey(input.templateKey);

  if (!template) {
    const builtIn = getMarketplaceTemplateByKey(input.templateKey);
    if (!builtIn) throw new Error("Template not found");

    template = await templateDefinitionsRepository.create({
      id: randomUUID(),
      key: builtIn.key,
      name: builtIn.name,
      slug: builtIn.slug,
      description: builtIn.description,
      category: builtIn.category,
      version: builtIn.version,
      thumbnailUrl: builtIn.thumbnailUrl || null,
      templateSpecJson: builtIn.templateSpecJson,
      tagsJson: builtIn.tags,
      isPublished: true
    });
  }

  const spec = template.templateSpecJson as any;
  const projectName = input.projectName || template.name;
  const project = await projectsRepository.create({
    organizationId: input.organizationId,
    name: projectName,
    slug: slugify(projectName),
    description: input.projectDescription || template.description || undefined,
    createdByUserId: input.createdByUserId
  });

  const version = await projectVersionsRepository.create({
    projectId: project.id,
    versionNumber: 1,
    appSpecJson: spec,
    specSchemaVersion: String(spec?.meta?.version || "1.0.0"),
    createdByUserId: input.createdByUserId,
    notes: `Initialized from template ${template.key}`
  });

  await projectsRepository.update(project.id, { latestVersionId: version.id });

  const installation = await templateInstallationsRepository.create({
    id: randomUUID(),
    organizationId: input.organizationId,
    templateDefinitionId: template.id,
    installedByUserId: input.createdByUserId,
    projectId: project.id,
    status: "INSTALLED"
  });

  return { template, project, version, installation };
}
