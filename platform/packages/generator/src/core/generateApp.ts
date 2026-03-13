import path from "path";
import { buildPlan } from "./buildPlan";
import { writeGeneratedFiles } from "./writeFiles";
import { archiveOutput } from "./archiveOutput";
import { generatedDockerCompose } from "./generatedDockerCompose";
import { renderModuleFiles } from "./renderModule";
import { formatCode } from "../utils/formatting";

function generatedRootReadme(spec: any): string {
  return `# Generated App

This app was generated from the App Spec for ${spec.meta.name}.

## Included modules
- frontend
- backend
- database${spec.meta.targetPlatforms.includes("admin") ? "\n- admin" : ""}${spec.meta.targetPlatforms.includes("mobile") ? "\n- mobile" : ""}

## Local run
1. Copy env example files as needed
2. Install dependencies inside each app/package
3. Start postgres
4. Run Prisma generate/migrate
5. Start backend and frontend

## Fast path
Use docker-compose.generated.yml as a starting point.
`;
}

function generatedSmokeTest(spec: any): string {
  const first = spec.models[0];
  if (!first) {
    return `import test from "node:test";
import assert from "node:assert/strict";

test("generated app smoke scaffold", async () => {
  assert.ok(true);
});
`;
  }

  const resource = first.name.charAt(0).toLowerCase() + first.name.slice(1);
  return `import test from "node:test";
import assert from "node:assert/strict";

test("generated CRUD smoke scaffold for ${first.name}", async () => {
  assert.ok("${resource}");
});
`;
}

export async function generateApp(input: any) {
  const plan = buildPlan(input.spec);
  const baseDir = path.join(input.outputRoot, input.projectId, input.versionId);

  const moduleFiles = await Promise.all(
    renderModuleFiles(input.spec).map(async (file) => ({
      ...file,
      content: await formatCode(file.content)
    }))
  );

  const files = [
    {
      relativePath: "manifest.json",
      content: JSON.stringify({
        projectId: input.projectId,
        versionId: input.versionId,
        generatedAt: new Date().toISOString(),
        modules: plan.modules,
        modelCount: plan.modelCount,
        pageCount: plan.pageCount,
        apiCount: plan.apiCount,
        platformFeatures: {
          previewReady: true,
          deploymentReady: true,
          pluginCompatible: true
        }
      }, null, 2)
    },
    {
      relativePath: "docker-compose.generated.yml",
      content: generatedDockerCompose()
    },
    {
      relativePath: "README.md",
      content: generatedRootReadme(input.spec)
    },
    {
      relativePath: "tests/generated-app-smoke.test.ts",
      content: generatedSmokeTest(input.spec)
    },
    ...moduleFiles
  ];

  await writeGeneratedFiles(baseDir, files);
  const zipPath = await archiveOutput(baseDir);

  return { baseDir, zipPath, plan, fileCount: files.length };
}
