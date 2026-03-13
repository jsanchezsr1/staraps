import { z } from "zod";

export const APP_SPEC_SCHEMA_VERSION = "1.0.0" as const;

const identifier = z.string().min(1).max(100);
const routePath = z.string().min(1).regex(/^\//, "Route must start with /");
const appFieldTypeSchema = z.enum(["string", "number", "boolean", "date", "text", "relation"]);
const relationKindSchema = z.enum(["one-to-one", "one-to-many", "many-to-many"]);
const pageTypeSchema = z.enum(["list", "detail", "form", "dashboard", "custom"]);
const authProviderSchema = z.enum(["email", "google", "github"]);
const targetPlatformSchema = z.enum(["web", "mobile", "admin"]);
const apiActionSchema = z.enum(["list", "get", "create", "update", "delete", "custom"]);
const httpMethodSchema = z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]);

export const AppFieldSchema = z.object({
  name: identifier,
  type: appFieldTypeSchema,
  required: z.boolean().optional().default(false),
  unique: z.boolean().optional().default(false),
  list: z.boolean().optional().default(false),
  relation: z.object({
    model: identifier,
    kind: relationKindSchema
  }).optional()
}).superRefine((value, ctx) => {
  if (value.type === "relation" && !value.relation) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "relation metadata is required when type is relation" });
  }
});

export const AppModelSchema = z.object({
  name: identifier,
  fields: z.array(AppFieldSchema).min(1)
});

export const AppPageSchema = z.object({
  name: identifier,
  path: routePath,
  type: pageTypeSchema,
  model: identifier.optional(),
  components: z.array(identifier).optional().default([]),
  authRequired: z.boolean().optional().default(true)
});

export const ApiEndpointSchema = z.object({
  name: identifier,
  method: httpMethodSchema,
  path: routePath,
  model: identifier.optional(),
  action: apiActionSchema.optional(),
  authRequired: z.boolean().optional().default(true)
});

export const UIComponentSpecSchema = z.object({
  name: identifier,
  type: identifier,
  props: z.record(z.any()).optional().default({})
});

export const IntegrationSpecSchema = z.object({
  name: identifier,
  provider: identifier,
  config: z.record(z.any()).optional().default({}),
  enabled: z.boolean().optional().default(true)
});

export const WorkflowStepSchema = z.object({
  name: identifier,
  type: identifier,
  config: z.record(z.any()).optional().default({})
});

export const WorkflowSpecSchema = z.object({
  name: identifier,
  trigger: z.object({
    type: identifier,
    config: z.record(z.any()).optional().default({})
  }),
  steps: z.array(WorkflowStepSchema).min(1)
});

export const AppSpecSchema = z.object({
  meta: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    version: z.string().default(APP_SPEC_SCHEMA_VERSION),
    targetPlatforms: z.array(targetPlatformSchema).min(1).default(["web", "admin"])
  }),
  auth: z.object({
    enabled: z.boolean(),
    providers: z.array(authProviderSchema).default(["email"]),
    roles: z.array(z.string()).optional().default([])
  }).optional(),
  models: z.array(AppModelSchema).default([]),
  pages: z.array(AppPageSchema).default([]),
  apis: z.array(ApiEndpointSchema).default([]),
  components: z.array(UIComponentSpecSchema).optional().default([]),
  integrations: z.array(IntegrationSpecSchema).optional().default([]),
  workflows: z.array(WorkflowSpecSchema).optional().default([])
}).superRefine((spec, ctx) => {
  const modelNames = new Set(spec.models.map((m) => m.name));
  for (const page of spec.pages) if (page.model && !modelNames.has(page.model)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Page ${page.name} references unknown model ${page.model}` });
  for (const api of spec.apis) if (api.model && !modelNames.has(api.model)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `API ${api.name} references unknown model ${api.model}` });
  for (const model of spec.models) for (const field of model.fields) if (field.relation && !modelNames.has(field.relation.model)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Model ${model.name} field ${field.name} references unknown model ${field.relation.model}` });
});

export type AppSpec = z.infer<typeof AppSpecSchema>;
export type AppModel = z.infer<typeof AppModelSchema>;

export function parseAppSpec(input: unknown): AppSpec {
  return AppSpecSchema.parse(input);
}

export function createEmptyAppSpec(input: { name: string; slug: string; description?: string; targetPlatforms?: Array<"web" | "mobile" | "admin">; }): AppSpec {
  return AppSpecSchema.parse({
    meta: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      version: APP_SPEC_SCHEMA_VERSION,
      targetPlatforms: input.targetPlatforms?.length ? input.targetPlatforms : ["web", "admin"]
    },
    auth: { enabled: true, providers: ["email"], roles: ["owner", "admin"] },
    models: [],
    pages: [],
    apis: [],
    components: [],
    integrations: [],
    workflows: []
  });
}
