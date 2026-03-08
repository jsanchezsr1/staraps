import { z } from "zod";

export const acceptInviteSchema = z.object({
  organizationId: z.string().min(1)
});
