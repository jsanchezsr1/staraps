import { z } from "zod";

export const createAgentWorkflowSchema = z.object({
  name: z.string().min(1),
  prompt: z.string().min(5)
});

export const executeAgentWorkflowSchema = z.object({
  inputJson: z.record(z.any()).optional()
});
