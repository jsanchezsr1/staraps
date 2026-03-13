import type { RenderFile, TemplateDescriptor } from "@platform/templates";

export type RenderContext = Record<string, string>;

export function applyPattern(pattern: string, context: RenderContext): string {
  return pattern.replace(/\{\{(.*?)\}\}/g, (_match, key) => {
    const value = context[String(key).trim()];
    if (typeof value !== "string") {
      throw new Error(`Missing render context value for ${String(key).trim()}`);
    }
    return value;
  });
}

export function renderStaticTemplate(
  template: TemplateDescriptor,
  context: RenderContext,
  content: string
): RenderFile {
  return {
    relativePath: applyPattern(template.outputPathPattern, context),
    content,
    parser: template.parser
  };
}
