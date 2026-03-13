import type { AppModel } from "@platform/app-spec";

export function listPageTemplate(model: AppModel): string {
  return `export default function ${model.name}ListPage() {
  return (
    <main>
      <h1>${model.name} List</h1>
      <p>Generated list page for ${model.name}.</p>
    </main>
  );
}
`;
}

export function formPageTemplate(model: AppModel): string {
  return `export default function ${model.name}FormPage() {
  return (
    <main>
      <h1>Create ${model.name}</h1>
      <form>
        ${model.fields.map((f) => `<div>${f.name}</div>`).join("\n        ")}
      </form>
    </main>
  );
}
`;
}
