import type { CopilotSuggestion } from "./types";

export async function suggestSpecImprovements(input: {
  projectId: string;
  specJson?: Record<string, unknown>;
}) {
  const suggestions: CopilotSuggestion[] = [
    {
      type: "model",
      title: "Add audit fields",
      description: "Consider adding createdBy and updatedBy to core business models.",
      patchJson: {
        recommendations: ["createdBy", "updatedBy"]
      }
    },
    {
      type: "page",
      title: "Add dashboard page",
      description: "Create a dashboard page summarizing high-value metrics.",
      patchJson: {
        page: { name: "Dashboard", path: "/dashboard", type: "dashboard" }
      }
    }
  ];

  return suggestions;
}

export async function suggestGenerationFixes(input: {
  projectId: string;
  diagnostics?: string[];
}) {
  return [
    {
      type: "fix",
      title: "Check missing model references",
      description: "A page or API may reference a model that does not exist in the App Spec."
    },
    {
      type: "fix",
      title: "Validate generated JSON",
      description: "Ensure prompt output or patch output is valid JSON before generation."
    }
  ];
}

export async function explainDiagnostics(input: {
  projectId: string;
  diagnostics?: string[];
}) {
  return {
    summary: "The most common issue is invalid or incomplete App Spec structure.",
    details: input.diagnostics || []
  };
}
