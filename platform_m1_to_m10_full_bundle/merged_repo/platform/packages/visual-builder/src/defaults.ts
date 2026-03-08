import type { VisualBuilderCanvasState } from "./types";

export function createDefaultCanvas(projectId: string, projectVersionId?: string): VisualBuilderCanvasState {
  return {
    projectId,
    projectVersionId,
    rootNodes: [
      {
        id: "page-home",
        type: "page",
        name: "Home",
        children: [
          {
            id: "section-hero",
            type: "section",
            name: "Hero",
            children: [
              {
                id: "text-title",
                type: "text",
                name: "Title",
                propsJson: { text: "Welcome" }
              }
            ]
          }
        ]
      }
    ],
    selectedNodeId: "page-home"
  };
}
