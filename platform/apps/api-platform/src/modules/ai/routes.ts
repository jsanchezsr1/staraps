import { Express } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import { aiGenerateSchema } from "../../validators/ai-builder.dto";
import { generateAppSpec } from "../../services/aiBuilder";
import { writeAuditLog } from "../../utils/audit";

export function registerAIRoutes(app: Express): void {

  app.post("/api/ai/generate-spec", requireAuth, validateBody(aiGenerateSchema), async (req, res) => {
    const spec = await generateAppSpec(req.body.prompt);

    await writeAuditLog({
      actorUserId: req.user?.id,
      action: "ai.generate.spec",
      entityType: "AppSpec",
      entityId: "ai-generated"
    });

    res.json(spec);
  });

}
