export async function transformCanvasToSpec(input: {
  projectId: string;
  canvasJson: Record<string, unknown>;
}) {
  const rootNodes = Array.isArray((input.canvasJson as any).rootNodes) ? (input.canvasJson as any).rootNodes : [];
  return {
    meta: {
      name: "VisualBuilderApp",
      slug: "visual-builder-app",
      version: "1.0.0",
      targetPlatforms: ["web", "admin"]
    },
    models: [],
    pages: rootNodes.map((node: any) => ({
      name: node.name || "Page",
      path: node.propsJson?.path || `/${node.id}`,
      type: "custom"
    })),
    apis: []
  };
}
