import { randomUUID } from "crypto";
import { Express } from "express";
import {
  builderStateRepository,
  pluginInstallationsRepository,
  platformJobsRepository,
  projectVersionsRepository,
  projectsRepository,
  previewEnvironmentsRepository,
  OrganizationRole
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { requireOrgRole } from "../../middleware/requireOrgRole";
import { validateBody } from "../../validators/common";
import {
  aiSpecDraftSchema,
  createDeploymentJobSchema,
  createPreviewJobSchema
} from "../../validators/platform-jobs.dto";
import { configureProviderSchema } from "../../validators/platform-providers.dto";
import {
  builderStateSchema,
  previewRefreshSchema,
  specPatchSchema
} from "../../validators/visual-builder.dto";
import {
  enqueueDeploymentJob,
  enqueuePreviewJob,
  enqueuePreviewRefresh
} from "../../services/platformQueue";
import { generateAiSpecDraft } from "../../services/aiProviders";
import { saveBuilderState, applySpecPatch } from "../../services/visualBuilder";
import { writeAuditLog } from "../../utils/audit";
import { listPlugins, listExternalPluginManifests } from "@platform/plugins";
import { deploymentProviders, previewProviders } from "../../services/platformProviders";

export function registerPlatformRoutes(app: Express): void {
  app.get("/api/platform/plugins", requireAuth, async (_req, res) => {
    res.json({
      builtIn: listPlugins(),
      external: listExternalPluginManifests()
    });
  });

  app.get("/api/platform/providers", requireAuth, async (_req, res) => {
    res.json({
      previewProviders,
      deploymentProviders
    });
  });

  app.get("/api/projects/:id/platform-jobs", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const jobs = await platformJobsRepository.listByProject(req.params.id);
    res.json(jobs);
  });

  app.get("/api/projects/:id/previews", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const previews = await previewEnvironmentsRepository.listByProject(req.params.id);
    res.json(previews);
  });

  app.get("/api/projects/:id/builder-state", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const state = await builderStateRepository.findByProjectId(req.params.id);
    res.json(state);
  });

  app.post("/api/projects/:id/builder-state", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(builderStateSchema), async (req, res) => {
    const state = await saveBuilderState({
      projectId: req.params.id,
      projectVersionId: req.body.projectVersionId,
      selectedNodeId: req.body.selectedNodeId,
      layoutJson: req.body.layoutJson
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "visual_builder.state.save",
      entityType: "BuilderState",
      entityId: state.id
    });

    res.status(201).json(state);
  });

  app.post("/api/projects/:id/spec-patch", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(specPatchSchema), async (req, res) => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const project = await projectsRepository.findById(req.params.id);
    if (!project?.latestVersionId) {
      res.status(404).json({ message: "Latest project version not found" });
      return;
    }

    const version = await applySpecPatch({
      projectId: req.params.id,
      versionId: project.latestVersionId,
      patch: req.body.patch,
      createdByUserId: req.user.id
    });

    await writeAuditLog({
      actorUserId: req.user.id,
      projectId: req.params.id,
      action: "visual_builder.spec_patch.apply",
      entityType: "ProjectVersion",
      entityId: version.id
    });

    res.status(201).json(version);
  });

  app.post("/api/projects/:id/preview-refresh", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(previewRefreshSchema), async (req, res) => {
    await enqueuePreviewRefresh({
      projectId: req.params.id,
      versionId: req.body.versionId,
      target: req.body.target
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "preview.refresh.enqueue",
      entityType: "PreviewRefreshJob",
      metadataJson: req.body
    });

    res.status(202).json({ ok: true });
  });

  app.post("/api/projects/:id/preview", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createPreviewJobSchema), async (req, res) => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const project = await projectsRepository.findById(req.params.id);
    const version = await projectVersionsRepository.findById(req.body.versionId);

    if (!project || !version) {
      res.status(404).json({ message: "Project or version not found" });
      return;
    }

    const target = req.body.target || "local-docker";

    const job = await platformJobsRepository.create({
      id: randomUUID(),
      projectId: req.params.id,
      projectVersionId: req.body.versionId,
      requestedByUserId: req.user.id,
      type: "PREVIEW",
      status: "QUEUED",
      target
    });

    await enqueuePreviewJob({
      platformJobId: job.id,
      projectId: req.params.id,
      versionId: req.body.versionId,
      requestedByUserId: req.user.id,
      type: "PREVIEW",
      target
    });

    await writeAuditLog({
      actorUserId: req.user.id,
      projectId: req.params.id,
      action: "platform.preview.enqueue",
      entityType: "PlatformJob",
      entityId: job.id,
      metadataJson: { target }
    });

    res.status(202).json(job);
  });

  app.post("/api/projects/:id/deploy", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(createDeploymentJobSchema), async (req, res) => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const project = await projectsRepository.findById(req.params.id);
    const version = await projectVersionsRepository.findById(req.body.versionId);

    if (!project || !version) {
      res.status(404).json({ message: "Project or version not found" });
      return;
    }

    const job = await platformJobsRepository.create({
      id: randomUUID(),
      projectId: req.params.id,
      projectVersionId: req.body.versionId,
      requestedByUserId: req.user.id,
      type: "DEPLOYMENT",
      status: "QUEUED",
      target: req.body.target
    });

    await enqueueDeploymentJob({
      platformJobId: job.id,
      projectId: req.params.id,
      versionId: req.body.versionId,
      requestedByUserId: req.user.id,
      type: "DEPLOYMENT",
      target: req.body.target
    });

    await writeAuditLog({
      actorUserId: req.user.id,
      projectId: req.params.id,
      action: "platform.deployment.enqueue",
      entityType: "PlatformJob",
      entityId: job.id,
      metadataJson: { target: req.body.target }
    });

    res.status(202).json(job);
  });

  app.post("/api/platform/ai-spec-draft", requireAuth, validateBody(aiSpecDraftSchema), async (req, res) => {
    const draft = await generateAiSpecDraft({
      prompt: req.body.prompt,
      nameHint: req.body.nameHint,
      provider: req.body.provider || "rule-based"
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "platform.ai_spec_draft.generate",
      entityType: "AppSpecDraft"
    });

    res.json(draft);
  });

  app.post("/api/organizations/:id/plugins/install", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), async (req, res) => {
    const pluginKey = String(req.body?.pluginKey || "");
    if (!pluginKey) {
      res.status(400).json({ message: "pluginKey is required" });
      return;
    }

    const installation = await pluginInstallationsRepository.install({
      id: randomUUID(),
      organizationId: req.params.id,
      pluginKey,
      enabled: true,
      configJson: req.body?.configJson || null
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      organizationId: req.params.id,
      action: "platform.plugin.install",
      entityType: "PluginInstallation",
      entityId: installation.id,
      metadataJson: { pluginKey }
    });

    res.status(201).json(installation);
  });

  app.post("/api/organizations/:id/providers/configure", requireAuth, requireOrgRole([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN
  ]), validateBody(configureProviderSchema), async (req, res) => {
    await writeAuditLog({
      actorUserId: req.user?.id,
      organizationId: req.params.id,
      action: "platform.provider.configure",
      entityType: "ProviderConfig",
      metadataJson: req.body
    });

    res.status(201).json({
      ok: true,
      configured: req.body
    });
  });
}
