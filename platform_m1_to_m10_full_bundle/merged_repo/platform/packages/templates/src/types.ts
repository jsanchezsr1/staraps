export type TemplateModule = "frontend" | "backend" | "database" | "admin" | "mobile";

export type TemplateDescriptor = {
  key: string;
  module: TemplateModule;
  outputPathPattern: string;
  description: string;
  parser: "typescript" | "json" | "markdown" | "prisma" | "yaml";
};

export type RenderFile = {
  relativePath: string;
  content: string;
  parser: TemplateDescriptor["parser"];
};
