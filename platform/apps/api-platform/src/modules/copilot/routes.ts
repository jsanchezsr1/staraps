import { Express } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireProjectAccess } from "../../middleware/requireProjectAccess";
import { OrganizationRole } from "@platform/database";
import { validateBody } from "../../validators/common";
import {
  copilotChatSchema,
  copilotSuggestSchema,
  copilotDiagnosticsSchema
} from "../../validators/copilot.dto";
import {
  runProjectCopilotChat,
  runProjectSpecSuggestions,
  runProjectGenerationFixes,
  runProjectDiagnosticExplanation
} from "../../services/copilot";
import { writeAuditLog } from "../../utils/audit";

export function registerCopilotRoutes(app: Express): void {
  app.post("/api/projects/:id/copilot/chat", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), validateBody(copilotChatSchema), async (req, res) => {
    const result = await runProjectCopilotChat({
      projectId: req.params.id,
      messages: req.body.messages
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "copilot.chat",
      entityType: "CopilotChat"
    });

    res.json(result);
  });

  app.post("/api/projects/:id/copilot/suggest-spec", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(copilotSuggestSchema), async (req, res) => {
    const result = await runProjectSpecSuggestions({
      projectId: req.params.id,
      specJson: req.body.specJson
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "copilot.suggest_spec",
      entityType: "CopilotSuggestion"
    });

    res.json(result);
  });

  app.post("/api/projects/:id/copilot/fix-generation", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER
  ]), validateBody(copilotDiagnosticsSchema), async (req, res) => {
    const result = await runProjectGenerationFixes({
      projectId: req.params.id,
      diagnostics: req.body.diagnostics
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "copilot.fix_generation",
      entityType: "CopilotSuggestion"
    });

    res.json(result);
  });

  app.post("/api/projects/:id/copilot/explain-diagnostics", requireAuth, requireProjectAccess([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.DEVELOPER,
    OrganizationRole.VIEWER
  ]), validateBody(copilotDiagnosticsSchema), async (req, res) => {
    const result = await runProjectDiagnosticExplanation({
      projectId: req.params.id,
      diagnostics: req.body.diagnostics
    });

    await writeAuditLog({
      actorUserId: req.user?.id,
      projectId: req.params.id,
      action: "copilot.explain_diagnostics",
      entityType: "CopilotDiagnostic"
    });

    res.json(result);
  });
}
