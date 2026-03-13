"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSpecSchema = exports.WorkflowSpecSchema = exports.WorkflowStepSchema = exports.IntegrationSpecSchema = exports.UIComponentSpecSchema = exports.ApiEndpointSchema = exports.AppPageSchema = exports.AppModelSchema = exports.AppFieldSchema = exports.APP_SPEC_SCHEMA_VERSION = void 0;
exports.parseAppSpec = parseAppSpec;
exports.createEmptyAppSpec = createEmptyAppSpec;
const zod_1 = require("zod");
exports.APP_SPEC_SCHEMA_VERSION = "1.0.0";
const identifier = zod_1.z.string().min(1).max(100);
const routePath = zod_1.z.string().min(1).regex(/^\//, "Route must start with /");
const appFieldTypeSchema = zod_1.z.enum(["string", "number", "boolean", "date", "text", "relation"]);
const relationKindSchema = zod_1.z.enum(["one-to-one", "one-to-many", "many-to-many"]);
const pageTypeSchema = zod_1.z.enum(["list", "detail", "form", "dashboard", "custom"]);
const authProviderSchema = zod_1.z.enum(["email", "google", "github"]);
const targetPlatformSchema = zod_1.z.enum(["web", "mobile", "admin"]);
const apiActionSchema = zod_1.z.enum(["list", "get", "create", "update", "delete", "custom"]);
const httpMethodSchema = zod_1.z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]);
exports.AppFieldSchema = zod_1.z.object({
    name: identifier,
    type: appFieldTypeSchema,
    required: zod_1.z.boolean().optional().default(false),
    unique: zod_1.z.boolean().optional().default(false),
    list: zod_1.z.boolean().optional().default(false),
    relation: zod_1.z.object({
        model: identifier,
        kind: relationKindSchema
    }).optional()
}).superRefine((value, ctx) => {
    if (value.type === "relation" && !value.relation) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "relation metadata is required when type is relation" });
    }
});
exports.AppModelSchema = zod_1.z.object({
    name: identifier,
    fields: zod_1.z.array(exports.AppFieldSchema).min(1)
});
exports.AppPageSchema = zod_1.z.object({
    name: identifier,
    path: routePath,
    type: pageTypeSchema,
    model: identifier.optional(),
    components: zod_1.z.array(identifier).optional().default([]),
    authRequired: zod_1.z.boolean().optional().default(true)
});
exports.ApiEndpointSchema = zod_1.z.object({
    name: identifier,
    method: httpMethodSchema,
    path: routePath,
    model: identifier.optional(),
    action: apiActionSchema.optional(),
    authRequired: zod_1.z.boolean().optional().default(true)
});
exports.UIComponentSpecSchema = zod_1.z.object({
    name: identifier,
    type: identifier,
    props: zod_1.z.record(zod_1.z.any()).optional().default({})
});
exports.IntegrationSpecSchema = zod_1.z.object({
    name: identifier,
    provider: identifier,
    config: zod_1.z.record(zod_1.z.any()).optional().default({}),
    enabled: zod_1.z.boolean().optional().default(true)
});
exports.WorkflowStepSchema = zod_1.z.object({
    name: identifier,
    type: identifier,
    config: zod_1.z.record(zod_1.z.any()).optional().default({})
});
exports.WorkflowSpecSchema = zod_1.z.object({
    name: identifier,
    trigger: zod_1.z.object({
        type: identifier,
        config: zod_1.z.record(zod_1.z.any()).optional().default({})
    }),
    steps: zod_1.z.array(exports.WorkflowStepSchema).min(1)
});
exports.AppSpecSchema = zod_1.z.object({
    meta: zod_1.z.object({
        name: zod_1.z.string().min(1),
        slug: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
        version: zod_1.z.string().default(exports.APP_SPEC_SCHEMA_VERSION),
        targetPlatforms: zod_1.z.array(targetPlatformSchema).min(1).default(["web", "admin"])
    }),
    auth: zod_1.z.object({
        enabled: zod_1.z.boolean(),
        providers: zod_1.z.array(authProviderSchema).default(["email"]),
        roles: zod_1.z.array(zod_1.z.string()).optional().default([])
    }).optional(),
    models: zod_1.z.array(exports.AppModelSchema).default([]),
    pages: zod_1.z.array(exports.AppPageSchema).default([]),
    apis: zod_1.z.array(exports.ApiEndpointSchema).default([]),
    components: zod_1.z.array(exports.UIComponentSpecSchema).optional().default([]),
    integrations: zod_1.z.array(exports.IntegrationSpecSchema).optional().default([]),
    workflows: zod_1.z.array(exports.WorkflowSpecSchema).optional().default([])
}).superRefine((spec, ctx) => {
    const modelNames = new Set(spec.models.map((m) => m.name));
    for (const page of spec.pages)
        if (page.model && !modelNames.has(page.model))
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: `Page ${page.name} references unknown model ${page.model}` });
    for (const api of spec.apis)
        if (api.model && !modelNames.has(api.model))
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: `API ${api.name} references unknown model ${api.model}` });
    for (const model of spec.models)
        for (const field of model.fields)
            if (field.relation && !modelNames.has(field.relation.model))
                ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: `Model ${model.name} field ${field.name} references unknown model ${field.relation.model}` });
});
function parseAppSpec(input) {
    return exports.AppSpecSchema.parse(input);
}
function createEmptyAppSpec(input) {
    return exports.AppSpecSchema.parse({
        meta: {
            name: input.name,
            slug: input.slug,
            description: input.description,
            version: exports.APP_SPEC_SCHEMA_VERSION,
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
//# sourceMappingURL=index.js.map