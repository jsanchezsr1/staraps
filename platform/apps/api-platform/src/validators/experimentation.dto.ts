import { z } from "zod";

export const createExperimentSchema = z.object({
  name: z.string().min(1),
  targetMetric: z.enum(["conversion", "engagement", "retention", "revenue", "latency", "adoption"])
});

export const analyzeExperimentSchema = z.object({});
