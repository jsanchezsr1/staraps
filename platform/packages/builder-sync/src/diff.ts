import type { BuilderSyncConflict, BuilderSyncDiffEntry } from "./types";

export async function diffSpecAndCanvas(input: {
  specJson?: Record<string, unknown>;
  canvasJson?: Record<string, unknown>;
}) : Promise<{diff: BuilderSyncDiffEntry[]; conflicts: BuilderSyncConflict[]}> {
  const diff: BuilderSyncDiffEntry[] = [];
  const conflicts: BuilderSyncConflict[] = [];

  const specPages = Array.isArray((input.specJson as any)?.pages) ? (input.specJson as any).pages : [];
  const canvasPages = Array.isArray((input.canvasJson as any)?.rootNodes) ? (input.canvasJson as any).rootNodes : [];

  if (specPages.length !== canvasPages.length) {
    conflicts.push({
      type: "missing_node",
      path: "pages",
      message: "Spec page count and canvas root node count differ.",
      resolution: "manual"
    });
  }

  specPages.forEach((page: any, idx: number) => {
    diff.push({
      path: `pages[${idx}]`,
      operation: "update",
      source: "spec",
      payload: { name: page.name, path: page.path }
    });
  });

  canvasPages.forEach((node: any, idx: number) => {
    diff.push({
      path: `rootNodes[${idx}]`,
      operation: "update",
      source: "canvas",
      payload: { name: node.name, id: node.id }
    });
  });

  return { diff, conflicts };
}
