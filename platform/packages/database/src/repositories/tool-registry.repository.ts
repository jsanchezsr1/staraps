import { prisma } from "../client";

export const toolRegistryRepository = {
  upsert(data: {
    id: string;
    name: string;
    description: string;
    inputSchemaJson?: unknown;
    isEnabled?: boolean;
  }) {
    return prisma.toolRegistryEntry.upsert({
      where: { name: data.name },
      update: {
        description: data.description,
        inputSchemaJson: data.inputSchemaJson || null,
        isEnabled: data.isEnabled ?? true,
        updatedAt: new Date()
      },
      create: {
        ...data,
        isEnabled: data.isEnabled ?? true
      }
    });
  },

  listAll() {
    return prisma.toolRegistryEntry.findMany({
      orderBy: { name: "asc" }
    });
  }
};
