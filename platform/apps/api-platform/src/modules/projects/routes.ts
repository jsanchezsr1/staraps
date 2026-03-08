import { Express } from "express";
import { projectsRepository, generationJobsRepository, projectVersionsRepository, OrganizationRole } from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { slugify } from "@platform/shared";
import { enqueueGenerationJob } from "../../services/generationQueue";
import { validateBody } from "../../validators/common";
import { createProjectSchema, generateProjectSchema, updateProjectSchema } from "../../validators/projects.dto";
import { requireOrgRole } from "../../middleware/requireOrgRole";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";

export function registerProjectRoutes(app: Express): void {
  app.post("/api/projects", requireAuth, validateBody(createProjectSchema), requireOrgRole([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.DEVELOPER]), async (req, res) => {
    try {
      const { organizationId, name, slug, description } = req.body;
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const project = await projectsRepository.create({
        organizationId,
        name,
        slug: slug || slugify(name),
        description,
        createdByUserId: req.user.id
      });
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to create project", error: String(error) });
    }
  });

  app.get("/api/projects/:id", requireAuth, requireProjectAccess([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.DEVELOPER, OrganizationRole.VIEWER]), async (req, res) => {
    try {
      const project = await projectsRepository.findById(req.params.id);
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to get project", error: String(error) });
    }
  });

  app.patch("/api/projects/:id", requireAuth, validateBody(updateProjectSchema), requireProjectAccess([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.DEVELOPER]), async (req, res) => {
    try {
      const project = await projectsRepository.update(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project", error: String(error) });
    }
  });

  app.delete("/api/projects/:id", requireAuth, requireProjectAccess([OrganizationRole.OWNER, OrganizationRole.ADMIN]), async (req, res) => {
    try {
      const project = await projectsRepository.remove(req.params.id);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project", error: String(error) });
    }
  });

  app.post("/api/projects/:id/generate", requireAuth, validateBody(generateProjectSchema), requireProjectAccess([OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.DEVELOPER]), async (req, res) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const projectId = req.params.id;
      const { versionId } = req.body;
      const project = await projectsRepository.findById(projectId);
      const version = await projectVersionsRepository.findById(versionId);
      if (!project || !version) {
        res.status(404).json({ message: "Project or version not found" });
        return;
      }
      const job = await generationJobsRepository.create({
        projectId,
        projectVersionId: versionId,
        requestedByUserId: req.user.id
      });
      await enqueueGenerationJob({
        organizationId: project.organizationId,
        projectId,
        versionId,
        requestedByUserId: req.user.id,
        generationJobId: job.id
      });
      res.status(202).json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to enqueue generation job", error: String(error) });
    }
  });
}
