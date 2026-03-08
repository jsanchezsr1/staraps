import { createEmptyAppSpec } from "@platform/app-spec";
import { slugify } from "@platform/shared";

export function draftSpecFromPrompt(input: { prompt: string; nameHint?: string }) {
  const inferredName = input.nameHint || inferAppName(input.prompt);
  const slug = slugify(inferredName);

  const base = createEmptyAppSpec({
    name: inferredName,
    slug,
    targetPlatforms: ["web", "admin", "mobile"]
  });

  return {
    ...base,
    meta: {
      ...base.meta,
      description: input.prompt.slice(0, 240)
    },
    models: [
      {
        name: "Item",
        fields: [
          { name: "title", type: "string", required: true },
          { name: "description", type: "text", required: false },
          { name: "isActive", type: "boolean", required: true }
        ]
      }
    ],
    pages: [
      { name: "Items", path: "/items", type: "list", model: "Item", authRequired: true },
      { name: "Create Item", path: "/items/new", type: "form", model: "Item", authRequired: true }
    ],
    apis: [
      { name: "ListItems", method: "GET", path: "/api/items", model: "Item", action: "list", authRequired: true },
      { name: "CreateItem", method: "POST", path: "/api/items", model: "Item", action: "create", authRequired: true }
    ]
  };
}

function inferAppName(prompt: string): string {
  const trimmed = prompt.trim().split("\n")[0].slice(0, 50).trim();
  return trimmed.length ? trimmed.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "Generated App" : "Generated App";
}
