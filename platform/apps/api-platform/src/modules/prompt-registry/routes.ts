import { Express } from "express";
import {
  promptEvaluationsRepository,
  promptRunsRepository,
  promptTemplatesRepository,
  promptVersionsRepository
} from "@platform/database";
import { requireAuth } from "../../middleware/requireAuth";
import { validateBody } from "../../validators/common";
import {
  createPromptTemplateSchema,
  createPromptVersionSchema,
  evaluatePromptVersionSchema,
  runPromptVersionSchema
} from "../../validators/prompt-registry.dto";
import {
  createPromptTemplate,
  createPromptVersion,
  evaluatePrompt,
  runPromptVersion
} from "../../services/promptRegistry";

export function registerPromptRegistryRoutes(app: Express): void {
  app.get("/api/prompt-registry/templates", requireAuth, async (_req, res) => {
    const items = await promptTemplatesRepository.listAll();
    res.json(items);
  });

  app.post("/api/prompt-registry/templates", requireAuth, validateBody(createPromptTemplateSchema), async (req, res) => {
    const item = await createPromptTemplate({
      name: req.body.name,
      slug: req.body.slug,
      category: req.body.category,
      description: req.body.description,
      body: req.body.body,
      createdByUserId: req.user?.id
    });
    res.status(201).json(item);
  });

  app.get("/api/prompt-registry/templates/:id/versions", requireAuth, async (req, res) => {
    const items = await promptVersionsRepository.listByTemplate(req.params.id);
    res.json(items);
  });

  app.post("/api/prompt-registry/templates/:id/versions", requireAuth, validateBody(createPromptVersionSchema), async (req, res) => {
    const item = await createPromptVersion({
      promptTemplateId: req.params.id,
      body: req.body.body,
      changelog: req.body.changelog,
      createdByUserId: req.user?.id
    });
    res.status(201).json(item);
  });

  app.get("/api/prompt-registry/versions/:id/evaluations", requireAuth, async (req, res) => {
    const items = await promptEvaluationsRepository.listByVersion(req.params.id);
    res.json(items);
  });

  app.post("/api/prompt-registry/versions/:id/evaluate", requireAuth, validateBody(evaluatePromptVersionSchema), async (req, res) => {
    const item = await evaluatePrompt({
      promptVersionId: req.params.id,
      testInput: req.body.testInput
    });
    res.status(201).json(item);
  });

  app.get("/api/prompt-registry/versions/:id/runs", requireAuth, async (req, res) => {
    const items = await promptRunsRepository.listByVersion(req.params.id);
    res.json(items);
  });

  app.post("/api/prompt-registry/versions/:id/run", requireAuth, validateBody(runPromptVersionSchema), async (req, res) => {
    const item = await runPromptVersion({
      promptVersionId: req.params.id,
      inputText: req.body.inputText
    });
    res.status(201).json(item);
  });
}
