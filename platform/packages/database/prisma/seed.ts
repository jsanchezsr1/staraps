import { prisma } from "../src/client";
import { hashPassword } from "@platform/auth";
import { slugify } from "@platform/shared";
import { randomUUID } from "crypto";
import { OrganizationRole } from "@prisma/client";

async function main() {
  const email = "owner@example.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      email,
      passwordHash: await hashPassword("ChangeMe123!"),
      name: "Seed Owner"
    }
  });

  const org = await prisma.organization.create({
    data: {
      id: randomUUID(),
      name: "Seed Organization",
      slug: slugify("Seed Organization"),
      createdByUserId: user.id
    }
  });

  await prisma.organizationMembership.create({
    data: {
      id: randomUUID(),
      organizationId: org.id,
      userId: user.id,
      role: OrganizationRole.OWNER
    }
  });
}

main().finally(async () => prisma.$disconnect());
