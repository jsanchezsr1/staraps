import { z } from "zod";

export const copilotChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["system", "user", "assistant"]),
      content: z.string().min(1)
    })
  ).min(1)
});

export const copilotSuggestSchema = z.object({
  specJson: z.record(z.any()).optional()
});

export const copilotDiagnosticsSchema = z.object({
  diagnostics: z.array(z.string()).optional()
});
