import { z } from "zod";
export declare const APP_SPEC_SCHEMA_VERSION: "1.0.0";
export declare const AppFieldSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["string", "number", "boolean", "date", "text", "relation"]>;
    required: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    unique: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    list: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    relation: z.ZodOptional<z.ZodObject<{
        model: z.ZodString;
        kind: z.ZodEnum<["one-to-one", "one-to-many", "many-to-many"]>;
    }, "strip", z.ZodTypeAny, {
        model: string;
        kind: "one-to-one" | "one-to-many" | "many-to-many";
    }, {
        model: string;
        kind: "one-to-one" | "one-to-many" | "many-to-many";
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "text" | "relation";
    list: boolean;
    required: boolean;
    unique: boolean;
    relation?: {
        model: string;
        kind: "one-to-one" | "one-to-many" | "many-to-many";
    } | undefined;
}, {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "text" | "relation";
    relation?: {
        model: string;
        kind: "one-to-one" | "one-to-many" | "many-to-many";
    } | undefined;
    list?: boolean | undefined;
    required?: boolean | undefined;
    unique?: boolean | undefined;
}>, {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "text" | "relation";
    list: boolean;
    required: boolean;
    unique: boolean;
    relation?: {
        model: string;
        kind: "one-to-one" | "one-to-many" | "many-to-many";
    } | undefined;
}, {
    name: string;
    type: "string" | "number" | "boolean" | "date" | "text" | "relation";
    relation?: {
        model: string;
        kind: "one-to-one" | "one-to-many" | "many-to-many";
    } | undefined;
    list?: boolean | undefined;
    required?: boolean | undefined;
    unique?: boolean | undefined;
}>;
export declare const AppModelSchema: z.ZodObject<{
    name: z.ZodString;
    fields: z.ZodArray<z.ZodEffects<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["string", "number", "boolean", "date", "text", "relation"]>;
        required: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        unique: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        list: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        relation: z.ZodOptional<z.ZodObject<{
            model: z.ZodString;
            kind: z.ZodEnum<["one-to-one", "one-to-many", "many-to-many"]>;
        }, "strip", z.ZodTypeAny, {
            model: string;
            kind: "one-to-one" | "one-to-many" | "many-to-many";
        }, {
            model: string;
            kind: "one-to-one" | "one-to-many" | "many-to-many";
        }>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "string" | "number" | "boolean" | "date" | "text" | "relation";
        list: boolean;
        required: boolean;
        unique: boolean;
        relation?: {
            model: string;
            kind: "one-to-one" | "one-to-many" | "many-to-many";
        } | undefined;
    }, {
        name: string;
        type: "string" | "number" | "boolean" | "date" | "text" | "relation";
        relation?: {
            model: string;
            kind: "one-to-one" | "one-to-many" | "many-to-many";
        } | undefined;
        list?: boolean | undefined;
        required?: boolean | undefined;
        unique?: boolean | undefined;
    }>, {
        name: string;
        type: "string" | "number" | "boolean" | "date" | "text" | "relation";
        list: boolean;
        required: boolean;
        unique: boolean;
        relation?: {
            model: string;
            kind: "one-to-one" | "one-to-many" | "many-to-many";
        } | undefined;
    }, {
        name: string;
        type: "string" | "number" | "boolean" | "date" | "text" | "relation";
        relation?: {
            model: string;
            kind: "one-to-one" | "one-to-many" | "many-to-many";
        } | undefined;
        list?: boolean | undefined;
        required?: boolean | undefined;
        unique?: boolean | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    fields: {
        name: string;
        type: "string" | "number" | "boolean" | "date" | "text" | "relation";
        list: boolean;
        required: boolean;
        unique: boolean;
        relation?: {
            model: string;
            kind: "one-to-one" | "one-to-many" | "many-to-many";
        } | undefined;
    }[];
}, {
    name: string;
    fields: {
        name: string;
        type: "string" | "number" | "boolean" | "date" | "text" | "relation";
        relation?: {
            model: string;
            kind: "one-to-one" | "one-to-many" | "many-to-many";
        } | undefined;
        list?: boolean | undefined;
        required?: boolean | undefined;
        unique?: boolean | undefined;
    }[];
}>;
export declare const AppPageSchema: z.ZodObject<{
    name: z.ZodString;
    path: z.ZodString;
    type: z.ZodEnum<["list", "detail", "form", "dashboard", "custom"]>;
    model: z.ZodOptional<z.ZodString>;
    components: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    authRequired: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    path: string;
    type: "custom" | "list" | "detail" | "form" | "dashboard";
    components: string[];
    authRequired: boolean;
    model?: string | undefined;
}, {
    name: string;
    path: string;
    type: "custom" | "list" | "detail" | "form" | "dashboard";
    model?: string | undefined;
    components?: string[] | undefined;
    authRequired?: boolean | undefined;
}>;
export declare const ApiEndpointSchema: z.ZodObject<{
    name: z.ZodString;
    method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE"]>;
    path: z.ZodString;
    model: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodEnum<["list", "get", "create", "update", "delete", "custom"]>>;
    authRequired: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    path: string;
    authRequired: boolean;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    model?: string | undefined;
    action?: "custom" | "delete" | "list" | "get" | "create" | "update" | undefined;
}, {
    name: string;
    path: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    model?: string | undefined;
    authRequired?: boolean | undefined;
    action?: "custom" | "delete" | "list" | "get" | "create" | "update" | undefined;
}>;
export declare const UIComponentSpecSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    props: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    props: Record<string, any>;
}, {
    name: string;
    type: string;
    props?: Record<string, any> | undefined;
}>;
export declare const IntegrationSpecSchema: z.ZodObject<{
    name: z.ZodString;
    provider: z.ZodString;
    config: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    provider: string;
    config: Record<string, any>;
    enabled: boolean;
}, {
    name: string;
    provider: string;
    config?: Record<string, any> | undefined;
    enabled?: boolean | undefined;
}>;
export declare const WorkflowStepSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    config: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    config: Record<string, any>;
}, {
    name: string;
    type: string;
    config?: Record<string, any> | undefined;
}>;
export declare const WorkflowSpecSchema: z.ZodObject<{
    name: z.ZodString;
    trigger: z.ZodObject<{
        type: z.ZodString;
        config: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        config: Record<string, any>;
    }, {
        type: string;
        config?: Record<string, any> | undefined;
    }>;
    steps: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        config: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
        config: Record<string, any>;
    }, {
        name: string;
        type: string;
        config?: Record<string, any> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    trigger: {
        type: string;
        config: Record<string, any>;
    };
    steps: {
        name: string;
        type: string;
        config: Record<string, any>;
    }[];
}, {
    name: string;
    trigger: {
        type: string;
        config?: Record<string, any> | undefined;
    };
    steps: {
        name: string;
        type: string;
        config?: Record<string, any> | undefined;
    }[];
}>;
export declare const AppSpecSchema: z.ZodEffects<z.ZodObject<{
    meta: z.ZodObject<{
        name: z.ZodString;
        slug: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodDefault<z.ZodString>;
        targetPlatforms: z.ZodDefault<z.ZodArray<z.ZodEnum<["web", "mobile", "admin"]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        slug: string;
        version: string;
        targetPlatforms: ("web" | "mobile" | "admin")[];
        description?: string | undefined;
    }, {
        name: string;
        slug: string;
        description?: string | undefined;
        version?: string | undefined;
        targetPlatforms?: ("web" | "mobile" | "admin")[] | undefined;
    }>;
    auth: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
        providers: z.ZodDefault<z.ZodArray<z.ZodEnum<["email", "google", "github"]>, "many">>;
        roles: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        providers: ("email" | "google" | "github")[];
        roles: string[];
    }, {
        enabled: boolean;
        providers?: ("email" | "google" | "github")[] | undefined;
        roles?: string[] | undefined;
    }>>;
    models: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        fields: z.ZodArray<z.ZodEffects<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<["string", "number", "boolean", "date", "text", "relation"]>;
            required: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            unique: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            list: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            relation: z.ZodOptional<z.ZodObject<{
                model: z.ZodString;
                kind: z.ZodEnum<["one-to-one", "one-to-many", "many-to-many"]>;
            }, "strip", z.ZodTypeAny, {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            }, {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            }>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            list: boolean;
            required: boolean;
            unique: boolean;
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
        }, {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
            list?: boolean | undefined;
            required?: boolean | undefined;
            unique?: boolean | undefined;
        }>, {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            list: boolean;
            required: boolean;
            unique: boolean;
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
        }, {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
            list?: boolean | undefined;
            required?: boolean | undefined;
            unique?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        fields: {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            list: boolean;
            required: boolean;
            unique: boolean;
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
        }[];
    }, {
        name: string;
        fields: {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
            list?: boolean | undefined;
            required?: boolean | undefined;
            unique?: boolean | undefined;
        }[];
    }>, "many">>;
    pages: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        type: z.ZodEnum<["list", "detail", "form", "dashboard", "custom"]>;
        model: z.ZodOptional<z.ZodString>;
        components: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        authRequired: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        path: string;
        type: "custom" | "list" | "detail" | "form" | "dashboard";
        components: string[];
        authRequired: boolean;
        model?: string | undefined;
    }, {
        name: string;
        path: string;
        type: "custom" | "list" | "detail" | "form" | "dashboard";
        model?: string | undefined;
        components?: string[] | undefined;
        authRequired?: boolean | undefined;
    }>, "many">>;
    apis: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE"]>;
        path: z.ZodString;
        model: z.ZodOptional<z.ZodString>;
        action: z.ZodOptional<z.ZodEnum<["list", "get", "create", "update", "delete", "custom"]>>;
        authRequired: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        path: string;
        authRequired: boolean;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        model?: string | undefined;
        action?: "custom" | "delete" | "list" | "get" | "create" | "update" | undefined;
    }, {
        name: string;
        path: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        model?: string | undefined;
        authRequired?: boolean | undefined;
        action?: "custom" | "delete" | "list" | "get" | "create" | "update" | undefined;
    }>, "many">>;
    components: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        props: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
        props: Record<string, any>;
    }, {
        name: string;
        type: string;
        props?: Record<string, any> | undefined;
    }>, "many">>>;
    integrations: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        provider: z.ZodString;
        config: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        provider: string;
        config: Record<string, any>;
        enabled: boolean;
    }, {
        name: string;
        provider: string;
        config?: Record<string, any> | undefined;
        enabled?: boolean | undefined;
    }>, "many">>>;
    workflows: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        trigger: z.ZodObject<{
            type: z.ZodString;
            config: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            config: Record<string, any>;
        }, {
            type: string;
            config?: Record<string, any> | undefined;
        }>;
        steps: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            config: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            type: string;
            config: Record<string, any>;
        }, {
            name: string;
            type: string;
            config?: Record<string, any> | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        trigger: {
            type: string;
            config: Record<string, any>;
        };
        steps: {
            name: string;
            type: string;
            config: Record<string, any>;
        }[];
    }, {
        name: string;
        trigger: {
            type: string;
            config?: Record<string, any> | undefined;
        };
        steps: {
            name: string;
            type: string;
            config?: Record<string, any> | undefined;
        }[];
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    components: {
        name: string;
        type: string;
        props: Record<string, any>;
    }[];
    meta: {
        name: string;
        slug: string;
        version: string;
        targetPlatforms: ("web" | "mobile" | "admin")[];
        description?: string | undefined;
    };
    models: {
        name: string;
        fields: {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            list: boolean;
            required: boolean;
            unique: boolean;
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
        }[];
    }[];
    pages: {
        name: string;
        path: string;
        type: "custom" | "list" | "detail" | "form" | "dashboard";
        components: string[];
        authRequired: boolean;
        model?: string | undefined;
    }[];
    apis: {
        name: string;
        path: string;
        authRequired: boolean;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        model?: string | undefined;
        action?: "custom" | "delete" | "list" | "get" | "create" | "update" | undefined;
    }[];
    integrations: {
        name: string;
        provider: string;
        config: Record<string, any>;
        enabled: boolean;
    }[];
    workflows: {
        name: string;
        trigger: {
            type: string;
            config: Record<string, any>;
        };
        steps: {
            name: string;
            type: string;
            config: Record<string, any>;
        }[];
    }[];
    auth?: {
        enabled: boolean;
        providers: ("email" | "google" | "github")[];
        roles: string[];
    } | undefined;
}, {
    meta: {
        name: string;
        slug: string;
        description?: string | undefined;
        version?: string | undefined;
        targetPlatforms?: ("web" | "mobile" | "admin")[] | undefined;
    };
    components?: {
        name: string;
        type: string;
        props?: Record<string, any> | undefined;
    }[] | undefined;
    auth?: {
        enabled: boolean;
        providers?: ("email" | "google" | "github")[] | undefined;
        roles?: string[] | undefined;
    } | undefined;
    models?: {
        name: string;
        fields: {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
            list?: boolean | undefined;
            required?: boolean | undefined;
            unique?: boolean | undefined;
        }[];
    }[] | undefined;
    pages?: {
        name: string;
        path: string;
        type: "custom" | "list" | "detail" | "form" | "dashboard";
        model?: string | undefined;
        components?: string[] | undefined;
        authRequired?: boolean | undefined;
    }[] | undefined;
    apis?: {
        name: string;
        path: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        model?: string | undefined;
        authRequired?: boolean | undefined;
        action?: "custom" | "delete" | "list" | "get" | "create" | "update" | undefined;
    }[] | undefined;
    integrations?: {
        name: string;
        provider: string;
        config?: Record<string, any> | undefined;
        enabled?: boolean | undefined;
    }[] | undefined;
    workflows?: {
        name: string;
        trigger: {
            type: string;
            config?: Record<string, any> | undefined;
        };
        steps: {
            name: string;
            type: string;
            config?: Record<string, any> | undefined;
        }[];
    }[] | undefined;
}>, {
    components: {
        name: string;
        type: string;
        props: Record<string, any>;
    }[];
    meta: {
        name: string;
        slug: string;
        version: string;
        targetPlatforms: ("web" | "mobile" | "admin")[];
        description?: string | undefined;
    };
    models: {
        name: string;
        fields: {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            list: boolean;
            required: boolean;
            unique: boolean;
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
        }[];
    }[];
    pages: {
        name: string;
        path: string;
        type: "custom" | "list" | "detail" | "form" | "dashboard";
        components: string[];
        authRequired: boolean;
        model?: string | undefined;
    }[];
    apis: {
        name: string;
        path: string;
        authRequired: boolean;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        model?: string | undefined;
        action?: "custom" | "delete" | "list" | "get" | "create" | "update" | undefined;
    }[];
    integrations: {
        name: string;
        provider: string;
        config: Record<string, any>;
        enabled: boolean;
    }[];
    workflows: {
        name: string;
        trigger: {
            type: string;
            config: Record<string, any>;
        };
        steps: {
            name: string;
            type: string;
            config: Record<string, any>;
        }[];
    }[];
    auth?: {
        enabled: boolean;
        providers: ("email" | "google" | "github")[];
        roles: string[];
    } | undefined;
}, {
    meta: {
        name: string;
        slug: string;
        description?: string | undefined;
        version?: string | undefined;
        targetPlatforms?: ("web" | "mobile" | "admin")[] | undefined;
    };
    components?: {
        name: string;
        type: string;
        props?: Record<string, any> | undefined;
    }[] | undefined;
    auth?: {
        enabled: boolean;
        providers?: ("email" | "google" | "github")[] | undefined;
        roles?: string[] | undefined;
    } | undefined;
    models?: {
        name: string;
        fields: {
            name: string;
            type: "string" | "number" | "boolean" | "date" | "text" | "relation";
            relation?: {
                model: string;
                kind: "one-to-one" | "one-to-many" | "many-to-many";
            } | undefined;
            list?: boolean | undefined;
            required?: boolean | undefined;
            unique?: boolean | undefined;
        }[];
    }[] | undefined;
    pages?: {
        name: string;
        path: string;
        type: "custom" | "list" | "detail" | "form" | "dashboard";
        model?: string | undefined;
        components?: string[] | undefined;
        authRequired?: boolean | undefined;
    }[] | undefined;
    apis?: {
        name: string;
        path: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        model?: string | undefined;
        authRequired?: boolean | undefined;
        action?: "custom" | "delete" | "list" | "get" | "create" | "update" | undefined;
    }[] | undefined;
    integrations?: {
        name: string;
        provider: string;
        config?: Record<string, any> | undefined;
        enabled?: boolean | undefined;
    }[] | undefined;
    workflows?: {
        name: string;
        trigger: {
            type: string;
            config?: Record<string, any> | undefined;
        };
        steps: {
            name: string;
            type: string;
            config?: Record<string, any> | undefined;
        }[];
    }[] | undefined;
}>;
export type AppSpec = z.infer<typeof AppSpecSchema>;
export type AppModel = z.infer<typeof AppModelSchema>;
export declare function parseAppSpec(input: unknown): AppSpec;
export declare function createEmptyAppSpec(input: {
    name: string;
    slug: string;
    description?: string;
    targetPlatforms?: Array<"web" | "mobile" | "admin">;
}): AppSpec;
