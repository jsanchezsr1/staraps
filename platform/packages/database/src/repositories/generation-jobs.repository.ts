import { prisma, GenerationJobStatus } from "@prisma/client";

export const generationJobsRepository = {
  create(data: { projectId: string; projectVersionId: string; requestedByUserId?: string; status?: GenerationJobStatus; log?: string; }) {
    return prisma.generationJob.create({ data: { ...data, status: data.status ?? GenerationJobStatus.QUEUED } });
  },
  findById(id: string) { return prisma.generationJob.findUnique({ where: { id }, include: { artifacts: true } }); },
  updateStatus(id: string, data: { status: GenerationJobStatus; log?: string; artifactPath?: string; startedAt?: Date; finishedAt?: Date; }) {
    return prisma.generationJob.update({ where: { id }, data });
  }
};
