import type { ToolDefinition } from "./types";

export function getDefaultToolRegistry(): ToolDefinition[] {
  return [
    {
      name: "generator",
      description: "Run application generation or regeneration tasks."
    },
    {
      name: "deployment",
      description: "Trigger deployment planning, execution, or rollback."
    },
    {
      name: "database",
      description: "Inspect schema state and migration readiness."
    },
    {
      name: "preview",
      description: "Prepare or validate preview environments."
    },
    {
      name: "artifact_store",
      description: "Read or write generated artifacts and manifests."
    },
    {
      name: "external_api",
      description: "Call approved external APIs through a controlled interface."
    }
  ];
}
