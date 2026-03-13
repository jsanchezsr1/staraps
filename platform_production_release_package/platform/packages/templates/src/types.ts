export type TemplateParser =
  | "typescript"
  | "json"
  | "markdown"
  | "prisma"
  | "yaml"
  | string;

export type RenderFile = {
  relativePath: string;
  content: string;
  parser: TemplateParser;
};

export type TemplateDescriptor = {
  id: string;
  name: string;
  description?: string;
  files?: RenderFile[];
  metadata?: Record<string, unknown>;
};
