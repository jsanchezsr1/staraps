import { prismaScalarType } from "../utils/fieldMapping";

function renderPrismaField(field: any): string[] {
  if (field.type === "relation" && field.relation) {
    const relationIdField = `${field.name}Id`;
    return [
      `  ${relationIdField} String?`,
      `  ${field.name} ${field.relation.model}? @relation(fields: [${relationIdField}], references: [id])`
    ];
  }

  const prismaType = prismaScalarType(field);
  const required = field.required ? "" : "?";
  const unique = field.unique ? " @unique" : "";
  return [`  ${field.name} ${prismaType}${required}${unique}`];
}

function renderPrismaModel(model: any): string {
  const renderedFields = model.fields.flatMap(renderPrismaField).join("\n");
  return [
    `model ${model.name} {`,
    `  id String @id @default(cuid())`,
    renderedFields,
    `  createdAt DateTime @default(now())`,
    `  updatedAt DateTime @updatedAt`,
    `}`
  ].filter(Boolean).join("\n");
}

function renderSeed(spec: any): string {
  if (!spec.models.length) {
    return `console.log("No models to seed.");\n`;
  }

  const blocks = spec.models.map((model: any, idx: number) => {
    const scalarFields = model.fields.filter((field: any) => field.type !== "relation");
    const data = scalarFields.map((field: any) => {
      if (field.type === "number") return `${field.name}: ${idx + 1}`;
      if (field.type === "boolean") return `${field.name}: true`;
      if (field.type === "date") return `${field.name}: new Date().toISOString()`;
      return `${field.name}: "${model.name} sample ${idx + 1}"`;
    }).join(",\n      ");

    const delegate = model.name.charAt(0).toLowerCase() + model.name.slice(1);
    return `  await prisma.${delegate}.create({
    data: {
      ${data}
    }
  });`;
  }).join("\n\n");

  return `import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
${blocks}
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
`;
}

export function generatePrisma(spec: any) {
  const modelBlocks = spec.models.map((model: any) => renderPrismaModel(model)).join("\n\n");
  const schema = [
    `generator client {`,
    `  provider = "prisma-client-js"`,
    `}`,
    ``,
    `datasource db {`,
    `  provider = "postgresql"`,
    `  url      = env("DATABASE_URL")`,
    `}`,
    ``,
    modelBlocks,
    ``
  ].join("\n");

  return [
    {
      relativePath: "app/database/prisma/schema.prisma",
      content: schema,
      parser: "prisma"
    },
    {
      relativePath: "app/database/prisma/migrations/0001_init/migration.sql",
      content: "-- Run `prisma migrate dev --name init` after first install to generate engine-specific SQL.\nSELECT 1;\n",
      parser: "markdown"
    },
    {
      relativePath: "app/database/prisma/seed.ts",
      content: renderSeed(spec),
      parser: "typescript"
    },
    {
      relativePath: "app/database/package.json",
      content: JSON.stringify({
        name: `${spec.meta.slug}-database`,
        private: true,
        scripts: {
          "prisma:generate": "prisma generate",
          "prisma:migrate": "prisma migrate dev --name init",
          "prisma:deploy": "prisma migrate deploy",
          "prisma:seed": "tsx prisma/seed.ts"
        },
        dependencies: {
          "@prisma/client": "^5.17.0"
        },
        devDependencies: {
          "prisma": "^5.17.0",
          "tsx": "^4.16.2"
        }
      }, null, 2),
      parser: "json"
    },
    {
      relativePath: "app/database/README.md",
      content: "# Generated Database\n\nThis schema, migration bootstrap, and seed script were generated from the App Spec models.\n",
      parser: "markdown"
    }
  ];
}
