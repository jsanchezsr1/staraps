export async function transformSpecToCanvas(input: {
  projectId: string;
  specJson: Record<string, unknown>;
}) {
  const pages = Array.isArray((input.specJson as any).pages) ? (input.specJson as any).pages : [];
  return {
    projectId: input.projectId,
    rootNodes: pages.map((page: any, idx: number) => ({
      id: page.path || `page-${idx}`,
      type: "page",
      name: page.name || `Page ${idx + 1}`,
      propsJson: { path: page.path || "/" },
      children: []
    }))
  };
}
