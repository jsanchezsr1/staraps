import { Express } from "express";
import { generationJobsRepository, prisma, OrganizationRole } from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import path from "path";
import fs from "fs";

export function registerJobRoutes(app: Express): void {
  app.get("/api/jobs/:jobId", requireAuth, async (req, res) => {
    try {
      const job = await generationJobsRepository.findById(req.params.jobId);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.json({ ...job, progress: parseProgress(job.log ?? "") });
    } catch (error) {
      res.status(500).json({ message: "Failed to get job", error: String(error) });
    }
  });

  app.get("/api/jobs/:jobId/logs", requireAuth, async (req, res) => {
    try {
      const job = await generationJobsRepository.findById(req.params.jobId);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.json({ id: job.id, status: job.status, log: job.log ?? "", progress: parseProgress(job.log ?? "") });
    } catch (error) {
      res.status(500).json({ message: "Failed to get job logs", error: String(error) });
    }
  });

  app.get("/api/artifacts/:artifactId/download", requireAuth, async (req, res) => {
    try {
      const artifact = await prisma.generatedArtifact.findUnique({
        where: { id: req.params.artifactId },
        include: { generationJob: { include: { project: true } } }
      });
      if (!artifact) {
        res.status(404).json({ message: "Artifact not found" });
        return;
      }

      const project = artifact.generationJob.project;
      const membership = await prisma.organizationMembership.findUnique({
        where: {
          organizationId_userId: {
            organizationId: project.organizationId,
            userId: req.user!.id
          }
        }
      });

      if (!membership || ![
        OrganizationRole.OWNER,
        OrganizationRole.ADMIN,
        OrganizationRole.DEVELOPER,
        OrganizationRole.VIEWER
      ].includes(membership.role)) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const absolutePath = path.resolve(artifact.filePath);
      if (!fs.existsSync(absolutePath)) {
        res.status(404).json({ message: "Artifact file missing" });
        return;
      }

      res.download(absolutePath, artifact.fileName);
    } catch (error) {
      res.status(500).json({ message: "Failed to download artifact", error: String(error) });
    }
  });
}

function parseProgress(log: string): number {
  const match = log.match(/PROGRESS:(\d{1,3})/);
  if (!match) return 0;
  const n = Number(match[1]);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
}
