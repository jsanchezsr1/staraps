import { prisma } from "../client";

export const organizationSsoConfigRepository = {
  upsert(data: {
    id: string;
    organizationId: string;
    providerType: string;
    entryPoint?: string | null;
    issuer?: string | null;
    audience?: string | null;
    certificate?: string | null;
    enabled?: boolean;
  }) {
    return prisma.organizationSSOConfig.upsert({
      where: { organizationId: data.organizationId },
      update: {
        providerType: data.providerType,
        entryPoint: data.entryPoint || null,
        issuer: data.issuer || null,
        audience: data.audience || null,
        certificate: data.certificate || null,
        enabled: data.enabled ?? true
      },
      create: {
        ...data,
        enabled: data.enabled ?? true
      }
    });
  },

  findByOrganizationId(organizationId: string) {
    return prisma.organizationSSOConfig.findUnique({ where: { organizationId } });
  }
};
