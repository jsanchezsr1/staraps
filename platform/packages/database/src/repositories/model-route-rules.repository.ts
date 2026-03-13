import { prisma } from "../client";

export const modelRouteRulesRepository = {
  create(data: {
    id: string;
    taskType: string;
    providerName: string;
    modelName: string;
    priority?: number;
    reason?: string | null;
    isEnabled?: boolean;
  }) {
    return prisma.modelRouteRule.create({
      data: {
        ...data,
        priority: data.priority ?? 1,
        isEnabled: data.isEnabled ?? true
      }
    });
  },

  listAll() {
    return prisma.modelRouteRule.findMany({
      orderBy: [{ taskType: "asc" }, { priority: "asc" }]
    });
  }
};
