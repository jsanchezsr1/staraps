import { NextFunction, Request, Response } from "express";
import { prisma, OrganizationRole } from "@platform/database";

export function requireOrgRole(roles: OrganizationRole[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const organizationId =
      (req.body?.organizationId as string | undefined) ||
      (req.params.id as string | undefined) ||
      (req.params.organizationId as string | undefined);

    if (!organizationId) {
      res.status(400).json({ message: "organizationId is required for role check" });
      return;
    }

    const membership = await prisma.organizationMembership.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
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
