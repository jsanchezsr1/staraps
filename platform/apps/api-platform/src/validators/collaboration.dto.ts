import { z } from "zod";

export const startCollaborationSessionSchema = z.object({
  projectVersionId: z.string().optional()
});

export const collaborationPresenceSchema = z.object({
  status: z.enum(["active", "idle", "offline"]).default("active"),
  cursorJson: z.record(z.any()).optional(),
  selectedNodeId: z.string().optional()
});

export const createCommentSchema = z.object({
  projectVersionId: z.string().optional(),
  targetType: z.string().min(1),
  targetId: z.string().min(1),
  body: z.string().min(1).max(10000)
});
