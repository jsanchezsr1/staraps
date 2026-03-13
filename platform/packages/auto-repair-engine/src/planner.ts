import type { RepairAction, RepairDiagnostic } from "./types";

export async function planRepairActions(input: {
  diagnostics: RepairDiagnostic[];
}) : Promise<RepairAction[]> {
  const actions: RepairAction[] = [];

  for (const d of input.diagnostics) {
    if (d.type === "missing_api") {
      actions.push({
        type: "create_api",
        title: "Create missing API",
        description: "Generate a missing API endpoint to satisfy page interaction requirements.",
        payloadJson: { path: d.path }
      });
    } else if (d.type === "invalid_binding") {
      actions.push({
        type: "update_binding",
        title: "Update invalid binding",
        description: "Repair the binding to use an existing field or generated fallback.",
        payloadJson: { path: d.path }
      });
    } else {
      actions.push({
        type: "patch_schema",
        title: "Patch schema",
        description: "Apply a schema repair patch to stabilize generation.",
        payloadJson: { path: d.path }
      });
    }
  }

  return actions;
}
