import { Express } from "express";
import { parseAppSpec } from "@platform/app-spec";
import { projectVersionsRepository, projectsRepository, OrganizationRole } from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { validateBody } from "../../validators/common";
import { createVersionSchema } from "../../validators/versions.dto";

export function registerVersionRoutes(app: Express): void {
  app.post("/api/projects/:id/versions", requireAuth, validateBody(createVersionSchema), requireProjectAccess([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.DEVELOPER]), async (req, res) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const projectId = req.params.id;
      const { appSpecJson, notes } = req.body;
      const normalizedSpec = parseAppSpec(appSpecJson);
      const existingVersions = await projectVersionsRepository.listByProject(projectId);
      const nextVersionNumber = existingVersions.length > 0 ? existingVersions[0].versionNumber + 1 : 1;
      const version = await projectVersionsRepository.create({
        projectId,
        versionNumber: nextVersionNumber,
        appSpecJson: normalizedSpec,
        specSchemaVersion: normalizedSpec.meta.version,
        createdByUserId: req.user.id,
        notes
      });
      await projectsRepository.update(projectId, { latestVersionId: version.id });
      res.status(201).json(version);
    } catch (error) {
      res.status(500).json({ message: "Failed to create version", error: String(error) });
    }
  });

  app.get("/api/projects/:id/versions", requireAuth, requireProjectAccess([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.DEVELOPER, OrganizationRole.VIEWER]), async (req, res) => {
    try {
      const versions = await projectVersionsRepository.listByProject(req.params.id);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ message: "Failed to list versions", error: String(error) });
    }
  });

  app.get("/api/projects/:id/versions/:versionId", requireAuth, requireProjectAccess([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.DEVELOPER, OrganizationRole.VIEWER]), async (req, res) => {
    try {
      const version = await projectVersionsRepository.findById(req.params.versionId);
      if (!version) {
        res.status(404).json({ message: "Version not found" });
        return;
      }
      res.json(version);
    } catch (error) {
      res.status(500).json({ message: "Failed to get version", error: String(error) });
    }
  });

  app.post("/api/projects/:id/versions/:versionId/rollback", requireAuth, requireProjectAccess([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.DEVELOPER]), async (req, res) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const sourceVersion = await projectVersionsRepository.findById(req.params.versionId);
      if (!sourceVersion) {
        res.status(404).json({ message: "Source version not found" });
        return;
      }
      const existingVersions = await projectVersionsRepository.listByProject(req.params.id);
      const nextVersionNumber = existingVersions.length > 0 ? existingVersions[0].versionNumber + 1 : 1;
      const rollbackVersion = await projectVersionsRepository.create({
        projectId: req.params.id,
        versionNumber: nextVersionNumber,
        appSpecJson: sourceVersion.appSpecJson,
        specSchemaVersion: sourceVersion.specSchemaVersion,
        createdByUserId: req.user.id,
        notes: `Rollback from version ${sourceVersion.versionNumber}`
      });
      await projectsRepository.update(req.params.id, { latestVersionId: rollbackVersion.id });
      res.status(201).json(rollbackVersion);
    } catch (error) {
      res.status(500).json({ message: "Failed to rollback version", error: String(error) });
    }
  });
}
