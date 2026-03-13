import { randomUUID } from "crypto";
import { createInitialPromptVersion, evaluatePromptVersion } from "@platform/prompt-registry";
import {
  promptEvaluationsRepository,
  promptRunsRepository,
  promptTemplatesRepository,
  promptVersionsRepository
} from "@platform/database";

export async function createPromptTemplate(input: {
  name: string;
  slug: string;
  category: string;
  description?: string;
  body: string;
  createdByUserId?: string;
}) {
  const template = await promptTemplatesRepository.create({
    id: randomUUID(),
    name: input.name,
    slug: input.slug,
    category: input.category,
    description: input.description || null,
    createdByUserId: input.createdByUserId || null
  });

  const initial = await createInitialPromptVersion({
    template: {
      name: input.name,
      slug: input.slug,
      category: input.category as any,
      description: input.description,
      body: input.body
    }
  });

  await promptVersionsRepository.create({
    id: randomUUID(),
    promptTemplateId: template.id,
    versionNumber: initial.version,
    body: initial.body,
    changelog: initial.changelog,
    createdByUserId: input.createdByUserId || null
  });

  return template;
}

export async function createPromptVersion(input: {
  promptTemplateId: string;
  body: string;
  changelog?: string;
  createdByUserId?: string;
}) {
  const existing = await promptVersionsRepository.listByTemplate(input.promptTemplateId);
  const nextVersion = existing.length > 0 ? existing[0].versionNumber + 1 : 1;

  return promptVersionsRepository.create({
    id: randomUUID(),
    promptTemplateId: input.promptTemplateId,
    versionNumber: nextVersion,
    body: input.body,
    changelog: input.changelog || null,
    createdByUserId: input.createdByUserId || null
  });
}

export async function evaluatePrompt(input: {
  promptVersionId: string;
  testInput?: string;
}) {
  const version = await promptVersionsRepository.findById(input.promptVersionId);
  if (!version) throw new Error("Prompt version not found");

  const result = await evaluatePromptVersion({
    promptBody: version.body,
    testInput: input.testInput
  });

  return promptEvaluationsRepository.create({
    id: randomUUID(),
    promptVersionId: input.promptVersionId,
    status: result.status,
    summary: result.summary,
    scoreJson: result.score
  });
}

export async function runPromptVersion(input: {
  promptVersionId: string;
  inputText?: string;
}) {
  const run = await promptRunsRepository.create({
    id: randomUUID(),
    promptVersionId: input.promptVersionId,
    inputText: input.inputText || null,
    status: "completed",
    outputJson: {
      acknowledged: true,
      preview: "Prompt executed in registry runtime."
    }
  });

  return run;
}
