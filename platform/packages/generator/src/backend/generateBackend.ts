import { fieldZodType } from "../utils/fieldMapping";
import { toCamelCase, toKebabCase, toPascalCase } from "../utils/naming";

function modelPrismaDataAssignments(model: any): string {
  return model.fields
    .filter((field: any) => field.type !== "relation")
    .map((field: any) => `${field.name}: input.${field.name}`)
    .join(",\n        ");
}

function renderPrismaClient(): string {
  return `import { PrismaClient } from "@prisma/client";

declare global {
  var __generatedPrisma__: PrismaClient | undefined;
}

export const prisma =
  global.__generatedPrisma__ ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__generatedPrisma__ = prisma;
}
`;
}

function renderValidator(model: any): string {
  const createFields = model.fields
    .filter((field: any) => field.type !== "relation")
    .map((field: any) => `  ${field.name}: ${field.required ? fieldZodType(field) : `${fieldZodType(field)}.optional()`}`)
    .join(",\n");

  const updateFields = model.fields
    .filter((field: any) => field.type !== "relation")
    .map((field: any) => `  ${field.name}: ${fieldZodType(field)}.optional()`)
    .join(",\n");

  return `import { z } from "zod";

export const create${model.name}Schema = z.object({
${createFields}
});

export const update${model.name}Schema = z.object({
${updateFields}
});

export type Create${model.name}Input = z.infer<typeof create${model.name}Schema>;
export type Update${model.name}Input = z.infer<typeof update${model.name}Schema>;
`;
}

function renderRepository(model: any): string {
  const pascal = toPascalCase(model.name);
  const camel = toCamelCase(model.name);

  return `import { prisma } from "../lib/prisma";
import type { Create${pascal}Input, Update${pascal}Input } from "../validators/${toKebabCase(model.name)}.schema";

export const ${pascal}Repository = {
  list() {
    return prisma.${camel}.findMany({
      orderBy: { createdAt: "desc" }
    });
  },

  getById(id: string) {
    return prisma.${camel}.findUnique({
      where: { id }
    });
  },

  create(input: Create${pascal}Input) {
    return prisma.${camel}.create({
      data: {
        ${modelPrismaDataAssignments(model)}
      }
    });
  },

  update(id: string, input: Update${pascal}Input) {
    return prisma.${camel}.update({
      where: { id },
      data: input
    });
  },

  delete(id: string) {
    return prisma.${camel}.delete({
      where: { id }
    });
  }
};
`;
}

function renderService(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);

  return `import { ${pascal}Repository } from "../repositories/${resource}.repository";
import type { Create${pascal}Input, Update${pascal}Input } from "../validators/${resource}.schema";

export const ${pascal}Service = {
  list() {
    return ${pascal}Repository.list();
  },

  getById(id: string) {
    return ${pascal}Repository.getById(id);
  },

  create(input: Create${pascal}Input) {
    return ${pascal}Repository.create(input);
  },

  update(id: string, input: Update${pascal}Input) {
    return ${pascal}Repository.update(id, input);
  },

  delete(id: string) {
    return ${pascal}Repository.delete(id);
  }
};
`;
}

function renderController(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);

  return `import { Request, Response } from "express";
import { ${pascal}Service } from "../services/${resource}.service";

export const ${pascal}Controller = {
  async list(_req: Request, res: Response) {
    res.json(await ${pascal}Service.list());
  },

  async getById(req: Request, res: Response) {
    const record = await ${pascal}Service.getById(req.params.id);
    if (!record) {
      res.status(404).json({ message: "${pascal} not found" });
      return;
    }

    res.json(record);
  },

  async create(req: Request, res: Response) {
    const record = await ${pascal}Service.create(req.body);
    res.status(201).json(record);
  },

  async update(req: Request, res: Response) {
    try {
      const record = await ${pascal}Service.update(req.params.id, req.body);
      res.json(record);
    } catch {
      res.status(404).json({ message: "${pascal} not found" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await ${pascal}Service.delete(req.params.id);
      res.status(204).send();
    } catch {
      res.status(404).json({ message: "${pascal} not found" });
    }
  }
};
`;
}

function renderRoutes(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);

  return `import { Router } from "express";
import { ${pascal}Controller } from "../controllers/${resource}.controller";
import { create${pascal}Schema, update${pascal}Schema } from "../validators/${resource}.schema";

const router = Router();

router.get("/", ${pascal}Controller.list);
router.get("/:id", ${pascal}Controller.getById);
router.post("/", (req, _res, next) => {
  req.body = create${pascal}Schema.parse(req.body);
  next();
}, ${pascal}Controller.create);
router.patch("/:id", (req, _res, next) => {
  req.body = update${pascal}Schema.parse(req.body);
  next();
}, ${pascal}Controller.update);
router.delete("/:id", ${pascal}Controller.delete);

export default router;
`;
}

function renderEnv(): string {
  return `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/generated_app
PORT=3001
`;
}

function renderBackendIndex(spec: any): string {
  const imports = spec.models.map((model: any) => {
    const resource = toKebabCase(model.name);
    return `import ${resource}Router from "./routes/${resource}.routes";`;
  }).join("\n");

  const mounts = spec.models.map((model: any) => {
    const resource = toKebabCase(model.name);
    return `app.use("/api/${resource}", ${resource}Router);`;
  }).join("\n");

  return `import "dotenv/config";
import cors from "cors";
import express from "express";
${imports}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

${mounts}

const port = Number(process.env.PORT || 3001);

app.listen(port, () => {
  console.log(\`Generated backend running on \${port}\`);
});
`;
}

export function generateBackend(spec: any) {
  const files = [
    {
      relativePath: "app/backend/package.json",
      content: JSON.stringify({
        name: `${spec.meta.slug}-backend`,
        private: true,
        scripts: {
          dev: "tsx watch src/index.ts",
          build: "tsc",
          start: "node dist/index.js",
          "prisma:generate": "prisma generate",
          "prisma:migrate": "prisma migrate dev --name init",
          postinstall: "prisma generate"
        },
        dependencies: {
          "@prisma/client": "^5.17.0",
          cors: "^2.8.5",
          dotenv: "^16.4.5",
          express: "^4.19.2",
          zod: "^3.23.8"
        },
        devDependencies: {
          prisma: "^5.17.0",
          tsx: "^4.16.2",
          typescript: "^5.5.0"
        }
      }, null, 2),
      parser: "json"
    },
    {
      relativePath: "app/backend/Dockerfile",
      content: 'FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nEXPOSE 3001\nCMD ["npm","run","dev"]\n',
      parser: "markdown"
    },
    {
      relativePath: "app/backend/.env.example",
      content: renderEnv(),
      parser: "markdown"
    },
    {
      relativePath: "app/backend/src/index.ts",
      content: renderBackendIndex(spec),
      parser: "typescript"
    },
    {
      relativePath: "app/backend/src/lib/prisma.ts",
      content: renderPrismaClient(),
      parser: "typescript"
    }
  ];

  for (const model of spec.models) {
    const resource = toKebabCase(model.name);
    files.push(
      { relativePath: `app/backend/src/validators/${resource}.schema.ts`, content: renderValidator(model), parser: "typescript" },
      { relativePath: `app/backend/src/repositories/${resource}.repository.ts`, content: renderRepository(model), parser: "typescript" },
      { relativePath: `app/backend/src/services/${resource}.service.ts`, content: renderService(model), parser: "typescript" },
      { relativePath: `app/backend/src/controllers/${resource}.controller.ts`, content: renderController(model), parser: "typescript" },
      { relativePath: `app/backend/src/routes/${resource}.routes.ts`, content: renderRoutes(model), parser: "typescript" }
    );
  }

  return files;
}
