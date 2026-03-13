import { randomUUID } from "crypto";
import {
  createLaunchHandoff,
  createVentureBuildPlan,
  generateVentureAppSpec
} from "@platform/venture-builder";
import {
  ventureBuildRunsRepository,
  ventureGeneratedProjectsRepository
} from "@platform/database";

export async function createVentureBuildRun(input: {
  ventureIdeaId?: string;
  ventureName: string;
  marketCategory?: string;
  createdByUserId?: string;
}) {
  const run = await ventureBuildRunsRepository.create({
    id: randomUUID(),
    ventureIdeaId: input.ventureIdeaId || null,
    status: "planning",
    createdByUserId: input.createdByUserId || null,
    startedAt: new Date()
  });

  const plan = await createVentureBuildPlan({
    ventureName: input.ventureName,
    marketCategory: input.marketCategory
  });

  const spec = await generateVentureAppSpec({ plan });
  const handoff = await createLaunchHandoff({ plan, spec });

  await ventureBuildRunsRepository.update(run.id, {
    status: "deployment_ready",
    planJson: plan,
    appSpecJson: spec,
    launchHandoffJson: handoff,
    finishedAt: new Date()
  });

  await ventureGeneratedProjectsRepository.create({
    id: randomUUID(),
    ventureBuildRunId: run.id,
    projectName: plan.productName,
    projectSlug: String(spec.meta.slug),
    status: handoff.readiness,
    generatorJobRef: null,
    deploymentRef: null
  });

  return ventureBuildRunsRepository.findById(run.id);
}
