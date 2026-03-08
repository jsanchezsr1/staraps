export type CollaborationPresenceStatus = "active" | "idle" | "offline";

export type BuilderCursor = {
  x: number;
  y: number;
  nodeId?: string;
};

export type CollaborationActivityType =
  | "builder.opened"
  | "builder.closed"
  | "builder.node.selected"
  | "builder.comment.created"
  | "builder.comment.resolved"
  | "builder.spec.patched";

export type CollaborationCommentTarget = {
  type: "node" | "field" | "page" | "api" | "workspace";
  targetId: string;
};
