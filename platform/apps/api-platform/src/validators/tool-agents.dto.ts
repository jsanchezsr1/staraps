import { z } from "zod";

export const createToolAgentRunSchema = z.object({
  agentType: z.string().min(1),
  prompt: z.string().min(5)
});
