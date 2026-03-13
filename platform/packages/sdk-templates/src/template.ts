export interface TemplateDefinition {
  name: string;
  version: string;
  description?: string;
  generate(): Promise<void>;
}
