import { NextFunction, Request, Response } from "express";
import { prisma, OrganizationRole } from "@platform/database";

export function requireProjectAccess(roles: OrganizationRole[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const projectId = req.params.id || req.params.projectId;
    if (!projectId) {
      res.status(400).json({ message: "projectId is required" });
      return;
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const membership = await prisma.organizationMembership.findUnique({
      where: {
        organizationId_userId: {
          organizationId: project.organizationId,
          userId: req.user.id
        }
      }
    });

    if (!membership || !roles.includes(membership.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}
