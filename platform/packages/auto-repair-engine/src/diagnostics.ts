import type { RepairDiagnostic } from "./types";

export async function analyzeRepairDiagnostics(input: {
  projectId: string;
  diagnostics?: string[];
}) : Promise<RepairDiagnostic[]> {
  const base: RepairDiagnostic[] = [
    {
      type: "missing_api",
      path: "apis[0]",
      message: "Expected API endpoint is missing for a referenced page action.",
      severity: "high"
    },
    {
      type: "invalid_binding",
      path: "pages[0].components[0]",
      message: "Component binding references a field not present in the model.",
      severity: "medium"
    }
  ];

  if (input.diagnostics && input.diagnostics.length > 0) {
    return base.concat(
      input.diagnostics.map((item, idx) => ({
        type: "unknown" as const,
        path: `external[${idx}]`,
        message: item,
        severity: "medium" as const
      }))
    );
  }

  return base;
}
