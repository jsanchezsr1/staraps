import { prisma } from "../client";

export const modelProvidersRepository = {
  upsert(data: {
    id: string;
    name: string;
    displayName: string;
    isEnabled?: boolean;
    modelsJson?: unknown;
  }) {
    return prisma.modelProvider.upsert({
      where: { name: data.name },
      update: {
        displayName: data.displayName,
        isEnabled: data.isEnabled ?? true,
        modelsJson: data.modelsJson || null,
        updatedAt: new Date()
      },
      create: {
        ...data,
        isEnabled: data.isEnabled ?? true
      }
    });
  },

  listAll() {
    return prisma.modelProvider.findMany({
      orderBy: { name: "asc" }
    });
  }
};
