import { z } from "zod";

export const createBuilderSyncRunSchema = z.object({
  projectVersionId: z.string().optional(),
  sourceMode: z.enum(["spec_to_canvas", "canvas_to_spec", "bidirectional"]).default("bidirectional"),
  specJson: z.record(z.any()).optional(),
  canvasJson: z.record(z.any()).optional()
});

export const createRegenerationTriggerSchema = z.object({
  projectVersionId: z.string().optional(),
  triggerType: z.string().min(1),
  source: z.string().min(1),
  payloadJson: z.record(z.any()).optional()
});
