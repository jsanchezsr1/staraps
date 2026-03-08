import { toKebabCase, toPascalCase } from "../utils/naming";

function renderAdminList(model: any): string {
  const pascal = toPascalCase(model.name);
  const resource = toKebabCase(model.name);

  return `import Link from "next/link";

export default function ${pascal}AdminListPage() {
  return (
    <main>
      <h1>${pascal} Admin</h1>
      <p>Manage ${pascal} records here.</p>
      <Link href="/${resource}/new">Create</Link>
    </main>
  );
}
`;
}

function renderAdminDetail(model: any): string {
  const pascal = toPascalCase(model.name);
  return `export default function ${pascal}AdminDetailPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>${pascal} Admin Detail</h1>
      <p>ID: {params.id}</p>
    </main>
  );
}
`;
}

function renderAdminNew(model: any): string {
  const pascal = toPascalCase(model.name);
  return `export default function Create${pascal}AdminPage() {
  return (
    <main>
      <h1>Create ${pascal}</h1>
      <p>Generated admin create page.</p>
    </main>
  );
}
`;
}

export function generateAdmin(spec: any) {
  const files = [
    {
      relativePath: "app/admin/package.json",
      content: JSON.stringify({
        name: `${spec.meta.slug}-admin`,
        private: true,
        scripts: { dev: "next dev", build: "next build", start: "next start" },
        dependencies: { next: "^14.2.5", react: "^18.3.1", "react-dom": "^18.3.1" }
      }, null, 2),
      parser: "json"
    },
    {
      relativePath: "app/admin/Dockerfile",
      content: 'FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nEXPOSE 3002\nCMD ["npm","run","dev"]\n',
      parser: "markdown"
    },
    {
      relativePath: "app/admin/src/app/page.tsx",
      content: `export default function AdminHome() {\n  return <main><h1>${spec.meta.name} Admin</h1><p>Generated admin dashboard.</p></main>;\n}\n`,
      parser: "typescript"
    }
  ];

  for (const model of spec.models) {
    const resource = toKebabCase(model.name);
    files.push(
      { relativePath: `app/admin/src/app/${resource}/page.tsx`, content: renderAdminList(model), parser: "typescript" },
      { relativePath: `app/admin/src/app/${resource}/new/page.tsx`, content: renderAdminNew(model), parser: "typescript" },
      { relativePath: `app/admin/src/app/${resource}/[id]/page.tsx`, content: renderAdminDetail(model), parser: "typescript" }
    );
  }

  return files;
}
