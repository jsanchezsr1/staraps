import { z } from "zod";

export const createModelRouteRuleSchema = z.object({
  taskType: z.enum(["planning", "coding", "reasoning", "repair", "iteration", "evaluation", "chat", "fast_task"]),
  providerName: z.string().min(1),
  modelName: z.string().min(1),
  priority: z.number().int().positive().optional(),
  reason: z.string().optional()
});

export const createModelUsageLogSchema = z.object({
  projectId: z.string().optional(),
  taskType: z.enum(["planning", "coding", "reasoning", "repair", "iteration", "evaluation", "chat", "fast_task"]),
  promptTokens: z.number().int().nonnegative(),
  completionTokens: z.number().int().nonnegative()
});

export const routeModelSchema = z.object({
  taskType: z.enum(["planning", "coding", "reasoning", "repair", "iteration", "evaluation", "chat", "fast_task"])
});
