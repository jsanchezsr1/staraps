<<<<<<< HEAD
export type TemplateParser =
  | "typescript"
  | "json"
  | "markdown"
  | "prisma"
  | "yaml"
  | string;
=======
export type TemplateModule = "frontend" | "backend" | "database" | "admin" | "mobile";

export type TemplateDescriptor = {
  key: string;
  module: TemplateModule;
  outputPathPattern: string;
  description: string;
  parser: "typescript" | "json" | "markdown" | "prisma" | "yaml";
};
>>>>>>> 1e6f3bc09828941df8fa5837cc31adc361ae5090

export type RenderFile = {
  relativePath: string;
  content: string;
<<<<<<< HEAD
  parser: TemplateParser;
};

export type TemplateDescriptor = {
  id: string;
  name: string;
  description?: string;
  files?: RenderFile[];
  metadata?: Record<string, unknown>;
=======
  parser: TemplateDescriptor["parser"];
>>>>>>> 1e6f3bc09828941df8fa5837cc31adc361ae5090
};
