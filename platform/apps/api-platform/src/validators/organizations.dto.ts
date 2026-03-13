import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).optional()
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "DEVELOPER", "VIEWER"])
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["OWNER", "ADMIN", "DEVELOPER", "VIEWER"])
});
