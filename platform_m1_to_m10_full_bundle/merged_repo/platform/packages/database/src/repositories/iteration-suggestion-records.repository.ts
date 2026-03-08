import { prisma } from "../client";

export const iterationSuggestionRecordsRepository = {
  create(data: {
    id: string;
    iterationRunId: string;
    suggestionType: string;
    title: string;
    description: string;
    priority: string;
    payloadJson?: unknown;
  }) {
    return prisma.iterationSuggestionRecord.create({ data });
  },

  listByRun(iterationRunId: string) {
    return prisma.iterationSuggestionRecord.findMany({
      where: { iterationRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
