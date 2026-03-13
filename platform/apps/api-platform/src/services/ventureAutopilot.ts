import { randomUUID } from "crypto";
import {
  createVentureLoopPlan,
  determineLifecycleDecision,
  summarizeAutopilotRun
} from "@platform/venture-autopilot";
import {
  ventureAutopilotActionsRepository,
  ventureAutopilotRunsRepository,
  ventureLifecycleDecisionsRepository
} from "@platform/database";

export async function createVentureAutopilotRun(input: {
  opportunityName: string;
  marketCategory?: string;
  performanceScore?: number;
  createdByUserId?: string;
}) {
  const run = await ventureAutopilotRunsRepository.create({
    id: randomUUID(),
    status: "scanning",
    createdByUserId: input.createdByUserId || null,
    startedAt: new Date()
  });

  const plan = await createVentureLoopPlan({
    opportunityName: input.opportunityName,
    marketCategory: input.marketCategory
  });

  await ventureAutopilotActionsRepository.create({
    id: randomUUID(),
    ventureAutopilotRunId: run.id,
    actionType: "venture_creation",
    title: `Create venture for ${plan.opportunityName}`,
    status: "completed",
    payloadJson: plan
  });

  await ventureAutopilotActionsRepository.create({
    id: randomUUID(),
    ventureAutopilotRunId: run.id,
    actionType: "venture_build",
    title: `Build ${plan.ventureName}`,
    status: "completed",
    payloadJson: { ventureName: plan.ventureName }
  });

  await ventureAutopilotActionsRepository.create({
    id: randomUUID(),
    ventureAutopilotRunId: run.id,
    actionType: "venture_launch",
    title: `Launch ${plan.ventureName}`,
    status: "completed",
    payloadJson: { ventureName: plan.ventureName, launchMode: plan.launchMode }
  });

  const decision = await determineLifecycleDecision({
    ventureName: plan.ventureName,
    performanceScore: input.performanceScore
  });

  await ventureLifecycleDecisionsRepository.create({
    id: randomUUID(),
    ventureAutopilotRunId: run.id,
    decisionType: decision.decisionType,
    title: decision.title,
    description: decision.description,
    rationale: decision.rationale,
    payloadJson: decision.payloadJson || null
  });

  const summary = await summarizeAutopilotRun({
    ventureName: plan.ventureName,
    decision
  });

  await ventureAutopilotRunsRepository.update(run.id, {
    status: "completed",
    loopPlanJson: plan,
    summaryJson: summary,
    finishedAt: new Date()
  });

  return ventureAutopilotRunsRepository.findById(run.id);
}
