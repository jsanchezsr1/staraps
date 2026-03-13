export type VisualBuilderNodeType =
  | "page"
  | "section"
  | "grid"
  | "card"
  | "form"
  | "table"
  | "chart"
  | "button"
  | "text"
  | "input"
  | "custom";

export type VisualBuilderNode = {
  id: string;
  type: VisualBuilderNodeType;
  name: string;
  propsJson?: Record<string, unknown>;
  children?: VisualBuilderNode[];
};

export type VisualBuilderCanvasState = {
  projectId: string;
  projectVersionId?: string;
  rootNodes: VisualBuilderNode[];
  selectedNodeId?: string;
};

export type VisualBuilderPatch = {
  operation: "add" | "update" | "remove" | "move";
  nodeId: string;
  parentNodeId?: string;
  payload?: Record<string, unknown>;
};
