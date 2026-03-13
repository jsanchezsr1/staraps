import { z } from "zod";

export const createProductInsightRunSchema = z.object({
  inputMetricsJson: z.record(z.any()).optional()
});
