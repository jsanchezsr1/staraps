import { Express } from "express";
import { organizationsRepository, prisma, OrganizationRole } from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { requireOrgRole } from "../../middleware/requireOrgRole";
import { slugify } from "@platform/shared";
import { validateBody } from "../../validators/common";
import { createOrganizationSchema, inviteMemberSchema, updateMemberRoleSchema } from "../../validators/organizations.dto";
import { registerAcceptInviteRoute } from "./acceptInvite.route";

export function registerOrganizationRoutes(app: Express): void {
  app.post("/api/organizations", requireAuth, validateBody(createOrganizationSchema), async (req, res) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { name, slug } = req.body;
      const organization = await organizationsRepository.createWithOwner({
        name,
        slug: slug || slugify(name),
        createdByUserId: req.user.id
      });
      res.status(201).json(organization);
    } catch (error) {
      res.status(500).json({ message: "Failed to create organization", error: String(error) });
    }
  });

  app.get("/api/organizations", requireAuth, async (req, res) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const organizations = await organizationsRepository.listForUser(req.user.id);
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to list organizations", error: String(error) });
    }
  });

  app.post("/api/organizations/:id/invite", requireAuth, requireOrgRole([OrganizationRole.OWNER, OrganizationRole.ADMIN]), validateBody(inviteMemberSchema), async (req, res) => {
    try {
      const { email, role } = req.body;
      const organizationId = req.params.id;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const membership = await prisma.organizationMembership.upsert({
        where: { organizationId_userId: { organizationId, userId: user.id } },
        update: { role },
        create: { organizationId, userId: user.id, role }
      });

      res.status(201).json({
        membership,
        acceptanceHint: "Invited user should call POST /api/organizations/accept-invite after login."
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to invite member", error: String(error) });
    }
  });

  app.patch("/api/organizations/:id/members/:memberId/role", requireAuth, requireOrgRole([OrganizationRole.OWNER, OrganizationRole.ADMIN]), validateBody(updateMemberRoleSchema), async (req, res) => {
    try {
      const { role } = req.body;
      const organizationId = req.params.id;
      const memberId = req.params.memberId;
      const membership = await prisma.organizationMembership.update({
        where: { organizationId_userId: { organizationId, userId: memberId } },
        data: { role }
      });
      res.json(membership);
    } catch (error) {
      res.status(500).json({ message: "Failed to update member role", error: String(error) });
    }
  });

  registerAcceptInviteRoute(app);
}
