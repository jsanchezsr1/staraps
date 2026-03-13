import { prisma } from "../client";

export const repairDiagnosticRecordsRepository = {
  create(data: {
    id: string;
    repairRunId: string;
    diagnosticType: string;
    path: string;
    message: string;
    severity: string;
  }) {
    return prisma.repairDiagnosticRecord.create({ data });
  },

  listByRun(repairRunId: string) {
    return prisma.repairDiagnosticRecord.findMany({
      where: { repairRunId },
      orderBy: { createdAt: "asc" }
    });
  }
};
