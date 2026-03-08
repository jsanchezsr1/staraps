import type { IterationSuggestion, IterationAction } from "./types";

export async function planIterationSuggestions(input: {
  projectId: string;
  contextJson?: Record<string, unknown>;
}) : Promise<IterationSuggestion[]> {
  return [
    {
      type: "add_crud",
      title: "Add CRUD surfaces for core entities",
      description: "Generate list, detail, and form pages for missing business entities.",
      payloadJson: { target: "core_models" },
      priority: "high"
    },
    {
      type: "add_dashboard",
      title: "Add executive dashboard",
      description: "Create a dashboard with high-value KPIs and status widgets.",
      payloadJson: { page: "dashboard" },
      priority: "medium"
    },
    {
      type: "extend_api",
      title: "Extend API coverage",
      description: "Add endpoints for reporting and workflow-triggering actions.",
      payloadJson: { scope: "reporting" },
      priority: "medium"
    }
  ];
}

export async function planIterationActions(input: {
  suggestions: IterationSuggestion[];
}) : Promise<IterationAction[]> {
  const actions: IterationAction[] = [];

  for (const s of input.suggestions) {
    if (s.type === "add_crud") {
      actions.push({
        type: "create_page",
        title: "Create CRUD pages",
        description: "Generate list, detail, and form pages for uncovered entities.",
        payloadJson: s.payloadJson
      });
    } else if (s.type === "add_dashboard") {
      actions.push({
        type: "create_page",
        title: "Create dashboard page",
        description: "Add dashboard layout and data widgets.",
        payloadJson: s.payloadJson
      });
    } else if (s.type === "extend_api") {
      actions.push({
        type: "create_api",
        title: "Create reporting APIs",
        description: "Extend API surface for reports and aggregated metrics.",
        payloadJson: s.payloadJson
      });
    } else {
      actions.push({
        type: "patch_spec",
        title: "Patch App Spec",
        description: "Apply iteration patch to the application specification.",
        payloadJson: s.payloadJson
      });
    }
  }

  actions.push({
    type: "regenerate_app",
    title: "Regenerate application",
    description: "Run generator after applying iteration actions."
  });

  return actions;
}
