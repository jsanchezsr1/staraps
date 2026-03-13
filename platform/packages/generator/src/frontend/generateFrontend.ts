import { defaultFrontendInputType, fieldTsType } from "../utils/fieldMapping";
import { toKebabCase, toPascalCase } from "../utils/naming";

function renderModelType(model: any): string {
  const fields = model.fields
    .filter((field: any) => field.type !== "relation")
    .map((field: any) => `  ${field.name}${field.required ? "" : "?"}: ${fieldTsType(field)};`)
    .join("\n");

  return `export type ${model.name}Entity = {
  id: string;
${fields}
  createdAt: string;
  updatedAt: string;
};
`;
}

function renderApiClient(spec: any): string {
  const imports = spec.models.map((model: any) => {
    const resource = toKebabCase(model.name);
    return `import type { ${model.name}Entity } from "../types/${resource}";`;
  }).join("\n");

  const functions = spec.models.map((model: any) => {
    const pascal = toPascalCase(model.name);
    const resource = toKebabCase(model.name);

    return `export async function list${pascal}(): Promise<${model.name}Entity[]> {
  const response = await fetch(\`\${API_BASE}/api/${resource}\`, { cache: "no-store" });
  return response.json();
}

export async function get${pascal}(id: string): Promise<${model.name}Entity> {
  const response = await fetch(\`\${API_BASE}/api/${resource}/\${id}\`, { cache: "no-store" });
  return response.json();
}

export async function create${pascal}(payload: Partial<${model.name}Entity>): Promise<${model.name}Entity> {
  const response = await fetch(\`\${API_BASE}/api/${resource}\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function update${pascal}(id: string, payload: Partial<${model.name}Entity>): Promise<${model.name}Entity> {
  const response = await fetch(\`\${API_BASE}/api/${resource}/\${id}\`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function delete${pascal}(id: string): Promise<void> {
  await fetch(\`\${API_BASE}/api/${resource}/\${id}\`, {
    method: "DELETE"
  });
}
`;
  }).join("\n\n");

  return `const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

${imports}

${functions}
`;
}

function renderTableComponent(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);
  const visibleFields = model.fields.filter((field: any) => field.type !== "relation").slice(0, 4);
  const headers = visibleFields.map((field: any) => `<th>${field.name}</th>`).join("");
  const cells = visibleFields.map((field: any) => `<td>{String(item.${field.name} ?? "")}</td>`).join("");

  return `import Link from "next/link";
import type { ${model.name}Entity } from "../types/${resource}";

export function ${pascal}Table({ items }: { items: ${model.name}Entity[] }) {
  return (
    <table>
      <thead>
        <tr>${headers}<th>actions</th></tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            ${cells}
            <td>
              <Link href={\`/${resource}/\${item.id}\`}>view</Link>
              {" | "}
              <Link href={\`/${resource}/\${item.id}/edit\`}>edit</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`;
}

function renderFormComponent(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);

  const defaults = model.fields
    .filter((field: any) => field.type !== "relation")
    .map((field: any) => `${field.name}: initialValues?.${field.name} ?? ${field.type === "number" ? "0" : field.type === "boolean" ? "false" : '""'}`)
    .join(",\n    ");

  const inputs = model.fields
    .filter((field: any) => field.type !== "relation")
    .map((field: any) => {
      const inputType = defaultFrontendInputType(field);
      if (inputType === "checkbox") {
        return `<label>
        ${field.name}
        <input
          type="checkbox"
          checked={Boolean(form.${field.name})}
          onChange={(event) => setForm((current) => ({ ...current, ${field.name}: event.target.checked }))}
        />
      </label>`;
      }
      return `<label>
        ${field.name}
        <input
          type="${inputType}"
          value={String(form.${field.name} ?? "")}
          onChange={(event) => setForm((current) => ({ ...current, ${field.name}: ${inputType === "number" ? "Number(event.target.value || 0)" : "event.target.value"} }))}
        />
      </label>`;
    })
    .join("\n      ");

  return `"use client";

import { useState } from "react";
import type { ${model.name}Entity } from "../types/${resource}";

export function ${pascal}Form({
  initialValues,
  onSubmit
}: {
  initialValues?: Partial<${model.name}Entity>;
  onSubmit: (values: Partial<${model.name}Entity>) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<${model.name}Entity>>({
    ${defaults}
  });

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(form);
      }}
    >
      ${inputs}
      <button type="submit">Save</button>
    </form>
  );
}
`;
}

function renderListPage(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);

  return `import Link from "next/link";
import { list${pascal} } from "../../lib/api";
import { ${pascal}Table } from "../../components/${pascal}Table";

export default async function ${pascal}ListPage() {
  const data = await list${pascal}();

  return (
    <main>
      <h1>${pascal} List</h1>
      <Link href="/${resource}/new">Create ${pascal}</Link>
      <${pascal}Table items={data} />
    </main>
  );
}
`;
}

function renderNewPage(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);

  return `"use client";

import { useRouter } from "next/navigation";
import { create${pascal} } from "../../../lib/api";
import { ${pascal}Form } from "../../../components/${pascal}Form";

export default function Create${pascal}Page() {
  const router = useRouter();

  return (
    <main>
      <h1>Create ${pascal}</h1>
      <${pascal}Form
        onSubmit={async (values) => {
          await create${pascal}(values);
          router.push("/${resource}");
        }}
      />
    </main>
  );
}
`;
}

function renderDetailPage(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);

  return `import Link from "next/link";
import { get${pascal} } from "../../../lib/api";

export default async function ${pascal}DetailPage({ params }: { params: { id: string } }) {
  const record = await get${pascal}(params.id);

  return (
    <main>
      <h1>${pascal} Detail</h1>
      <pre>{JSON.stringify(record, null, 2)}</pre>
      <Link href={\`/${resource}/\${params.id}/edit\`}>Edit</Link>
    </main>
  );
}
`;
}

function renderEditPage(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);

  return `"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get${pascal}, update${pascal} } from "../../../../lib/api";
import { ${pascal}Form } from "../../../../components/${pascal}Form";

export default function Edit${pascal}Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    get${pascal}(params.id).then(setInitialValues);
  }, [params.id]);

  if (!initialValues) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <h1>Edit ${pascal}</h1>
      <${pascal}Form
        initialValues={initialValues}
        onSubmit={async (values) => {
          await update${pascal}(params.id, values);
          router.push("/${resource}");
        }}
      />
    </main>
  );
}
`;
}

function renderReadme(spec: any): string {
  return `# Generated Frontend

This frontend was generated from the App Spec for ${spec.meta.name}.

## Environment
Copy \`.env.example\` to \`.env.local\` and adjust the API base if needed.

## Run
- npm install
- npm run dev
`;
}

export function generateFrontend(spec: any) {
  const files = [
    {
      relativePath: "app/frontend/package.json",
      content: JSON.stringify({
        name: `${spec.meta.slug}-frontend`,
        private: true,
        scripts: { dev: "next dev", build: "next build", start: "next start" },
        dependencies: {
          next: "^14.2.5",
          react: "^18.3.1",
          "react-dom": "^18.3.1"
        }
      }, null, 2),
      parser: "json"
    },
    {
      relativePath: "app/frontend/Dockerfile",
      content: 'FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nEXPOSE 3000\nCMD ["npm","run","dev"]\n',
      parser: "markdown"
    },
    {
      relativePath: "app/frontend/.env.example",
      content: "NEXT_PUBLIC_API_BASE=http://localhost:3001\n",
      parser: "markdown"
    },
    {
      relativePath: "app/frontend/README.md",
      content: renderReadme(spec),
      parser: "markdown"
    },
    {
      relativePath: "app/frontend/src/app/page.tsx",
      content: `export default function HomePage() {\n  return <main><h1>${spec.meta.name}</h1><p>${spec.meta.description || "Generated frontend app"}</p></main>;\n}\n`,
      parser: "typescript"
    },
    {
      relativePath: "app/frontend/src/lib/api.ts",
      content: renderApiClient(spec),
      parser: "typescript"
    }
  ];

  for (const model of spec.models) {
    const resource = toKebabCase(model.name);
    const pascal = toPascalCase(model.name);

    files.push(
      { relativePath: `app/frontend/src/types/${resource}.ts`, content: renderModelType(model), parser: "typescript" },
      { relativePath: `app/frontend/src/components/${pascal}Table.tsx`, content: renderTableComponent(model), parser: "typescript" },
      { relativePath: `app/frontend/src/components/${pascal}Form.tsx`, content: renderFormComponent(model), parser: "typescript" },
      { relativePath: `app/frontend/src/app/${resource}/page.tsx`, content: renderListPage(model), parser: "typescript" },
      { relativePath: `app/frontend/src/app/${resource}/new/page.tsx`, content: renderNewPage(model), parser: "typescript" },
      { relativePath: `app/frontend/src/app/${resource}/[id]/page.tsx`, content: renderDetailPage(model), parser: "typescript" },
      { relativePath: `app/frontend/src/app/${resource}/[id]/edit/page.tsx`, content: renderEditPage(model), parser: "typescript" }
    );
  }

  return files;
}
