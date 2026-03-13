import { randomUUID } from "crypto";
import { createStartupConcept, createVentureThesis, scoreVentureConcept } from "@platform/venture-studio";
import {
  ventureCreationRunsRepository,
  ventureIdeasRepository,
  venturePortfolioRepository
} from "@platform/database";

export async function createVentureRun(input: {
  opportunityName: string;
  marketCategory?: string;
  createdByUserId?: string;
}) {
  const run = await ventureCreationRunsRepository.create({
    id: randomUUID(),
    status: "queued",
    inputJson: {
      opportunityName: input.opportunityName,
      marketCategory: input.marketCategory || null
    },
    createdByUserId: input.createdByUserId || null
  });

  const thesis = await createVentureThesis({
    opportunityName: input.opportunityName,
    marketCategory: input.marketCategory
  });
  const concept = await createStartupConcept({ thesis });
  const scorecard = await scoreVentureConcept({ thesis, concept });

  const idea = await ventureIdeasRepository.create({
    id: randomUUID(),
    ventureCreationRunId: run.id,
    name: concept.name,
    stage: "idea",
    thesisJson: thesis,
    conceptJson: concept,
    scorecardJson: scorecard
  });

  await venturePortfolioRepository.create({
    id: randomUUID(),
    ventureIdeaId: idea.id,
    name: concept.name,
    stage: "idea",
    statusSummary: scorecard.summary,
    metricsJson: { overallScore: scorecard.overallScore }
  });

  await ventureCreationRunsRepository.update(run.id, {
    status: "completed",
    summaryJson: { ventureIdeaId: idea.id, overallScore: scorecard.overallScore },
    finishedAt: new Date()
  });

  return ventureCreationRunsRepository.findById(run.id);
}
