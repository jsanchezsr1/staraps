import { z } from "zod";

export const aiGenerateSchema = z.object({
  prompt: z.string().min(10)
});
