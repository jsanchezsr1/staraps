import type { TemplateDescriptor } from "./types";

export const templateRegistry: TemplateDescriptor[] = [
  {
    key: "database/prisma-schema",
    module: "database",
    outputPathPattern: "app/database/prisma/schema.prisma",
    description: "Generated Prisma schema",
    parser: "prisma"
  },
  {
    key: "backend/route-crud",
    module: "backend",
    outputPathPattern: "app/backend/src/routes/{{resource}}.routes.ts",
    description: "Generated CRUD routes",
    parser: "typescript"
  },
  {
    key: "backend/controller-crud",
    module: "backend",
    outputPathPattern: "app/backend/src/controllers/{{resource}}.controller.ts",
    description: "Generated CRUD controller",
    parser: "typescript"
  },
  {
    key: "backend/service-crud",
    module: "backend",
    outputPathPattern: "app/backend/src/services/{{resource}}.service.ts",
    description: "Generated CRUD service",
    parser: "typescript"
  },
  {
    key: "backend/repository-crud",
    module: "backend",
    outputPathPattern: "app/backend/src/repositories/{{resource}}.repository.ts",
    description: "Generated CRUD repository",
    parser: "typescript"
  },
  {
    key: "backend/validator-crud",
    module: "backend",
    outputPathPattern: "app/backend/src/validators/{{resource}}.schema.ts",
    description: "Generated Zod schema",
    parser: "typescript"
  },
  {
    key: "frontend/page-list",
    module: "frontend",
    outputPathPattern: "app/frontend/src/app/{{resource}}/page.tsx",
    description: "Generated list page",
    parser: "typescript"
  },
  {
    key: "frontend/page-new",
    module: "frontend",
    outputPathPattern: "app/frontend/src/app/{{resource}}/new/page.tsx",
    description: "Generated create page",
    parser: "typescript"
  },
  {
    key: "frontend/page-detail",
    module: "frontend",
    outputPathPattern: "app/frontend/src/app/{{resource}}/[id]/page.tsx",
    description: "Generated detail page",
    parser: "typescript"
  },
  {
    key: "frontend/component-table",
    module: "frontend",
    outputPathPattern: "app/frontend/src/components/{{modelName}}Table.tsx",
    description: "Generated table component",
    parser: "typescript"
  },
  {
    key: "frontend/component-form",
    module: "frontend",
    outputPathPattern: "app/frontend/src/components/{{modelName}}Form.tsx",
    description: "Generated form component",
    parser: "typescript"
  },
  {
    key: "admin/page-list",
    module: "admin",
    outputPathPattern: "app/admin/src/app/{{resource}}/page.tsx",
    description: "Generated admin list page",
    parser: "typescript"
  },
  {
    key: "admin/page-detail",
    module: "admin",
    outputPathPattern: "app/admin/src/app/{{resource}}/[id]/page.tsx",
    description: "Generated admin detail page",
    parser: "typescript"
  },
  {
    key: "mobile/screen-list",
    module: "mobile",
    outputPathPattern: "app/mobile/src/screens/{{modelName}}ListScreen.tsx",
    description: "Generated mobile list screen",
    parser: "typescript"
  },
  {
    key: "mobile/screen-detail",
    module: "mobile",
    outputPathPattern: "app/mobile/src/screens/{{modelName}}DetailScreen.tsx",
    description: "Generated mobile detail screen",
    parser: "typescript"
  }
];
