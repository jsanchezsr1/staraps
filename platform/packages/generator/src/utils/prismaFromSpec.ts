import type { AppSpec } from "@platform/app-spec";

function mapFieldType(type: string): string {
  switch (type) {
    case "string":
    case "text":
      return "String";
    case "number":
      return "Float";
    case "boolean":
      return "Boolean";
    case "date":
      return "DateTime";
    default:
      return "String";
  }
}

export function prismaSchemaFromSpec(spec: AppSpec): string {
  const models = spec.models.map((model) => {
    const fields = model.fields.map((field) => {
      if (field.type === "relation" && field.relation) {
        return `  ${field.name}Id String?\n  ${field.name} ${field.relation.model}? @relation(fields: [${field.name}Id], references: [id])`;
      }
      const type = mapFieldType(field.type);
      const optional = field.required ? "" : "?";
      const unique = field.unique ? " @unique" : "";
      return `  ${field.name} ${type}${optional}${unique}`;
    }).join("\n");

    return `model ${model.name} {\n  id String @id @default(cuid())\n${fields ? fields + "\n" : ""}  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}`;
  }).join("\n\n");

  return `generator client {\n  provider = "prisma-client-js"\n}\n\n` +
    `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n${models}\n`;
}
