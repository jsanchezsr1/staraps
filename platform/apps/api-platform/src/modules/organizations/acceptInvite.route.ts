import { Express } from "express";
import { prisma } from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { acceptInviteSchema } from "../../validators/invitations.dto";

export function registerAcceptInviteRoute(app: Express): void {
  app.post("/api/organizations/accept-invite", requireAuth, validateBody(acceptInviteSchema), async (req, res) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { organizationId } = req.body;
      const membership = await prisma.organizationMembership.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: req.user.id
          }
        }
      });
      if (!membership) {
        res.status(404).json({ message: "Membership not found" });
        return;
      }
      res.json({ ok: true, membership });
    } catch (error) {
      res.status(500).json({ message: "Failed to accept invite", error: String(error) });
    }
  });
}
