import { z } from "zod";

export const createPortfolioCompanySchema = z.object({
  venturePortfolioEntryId: z.string().optional(),
  name: z.string().min(1),
  status: z.enum(["active", "paused", "pivoting", "growing", "archived"]).default("active"),
  summary: z.string().optional()
});
