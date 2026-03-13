import { z } from "zod";

export const upsertVisualBuilderCanvasSchema = z.object({
  projectVersionId: z.string().optional(),
  stateJson: z.record(z.any())
});

export const createVisualBuilderPatchSchema = z.object({
  projectVersionId: z.string().optional(),
  nodeId: z.string().min(1),
  operation: z.enum(["add", "update", "remove", "move"]),
  patchJson: z.record(z.any()).optional()
});
