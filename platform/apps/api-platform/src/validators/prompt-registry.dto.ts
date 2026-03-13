import { z } from "zod";

export const createPromptTemplateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.enum(["system", "agent", "workflow", "evaluation", "repair", "iteration"]),
  description: z.string().optional(),
  body: z.string().min(1)
});

export const createPromptVersionSchema = z.object({
  body: z.string().min(1),
  changelog: z.string().optional()
});

export const evaluatePromptVersionSchema = z.object({
  testInput: z.string().optional()
});

export const runPromptVersionSchema = z.object({
  inputText: z.string().optional()
});
