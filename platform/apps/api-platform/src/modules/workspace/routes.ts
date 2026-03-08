import { Express } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { OrganizationRole, projectVersionsRepository, projectsRepository } from "@platform/database";
import { getProjectWorkspace } from "../../services/workspace";
import { diffAppSpecs } from "@platform/app-spec-diff";

export function registerWorkspaceRoutes(app: Express): void {
  app.get("/api/projects/:id/workspace", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const workspace = await getProjectWorkspace(req.params.id);
    res.json(workspace);
  });

  app.get("/api/projects/:id/diff/:leftVersionId/:rightVersionId", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const left = await projectVersionsRepository.findById(req.params.leftVersionId);
    const right = await projectVersionsRepository.findById(req.params.rightVersionId);

    if (!left || !right) {
      res.status(404).json({ message: "Version not found" });
      return;
    }

    const diff = diffAppSpecs(left.appSpecJson as any, right.appSpecJson as any);
    res.json({
      leftVersionId: left.id,
      rightVersionId: right.id,
      diff
    });
  });

  app.get("/api/projects/:id/version-summary", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), async (req, res) => {
    const project = await projectsRepository.findById(req.params.id);
    const versions = await projectVersionsRepository.listByProject(req.params.id);
    res.json({
      projectId: req.params.id,
      latestVersionId: project?.latestVersionId || null,
      versions
    });
  });
}
