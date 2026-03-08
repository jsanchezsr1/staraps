import type { AppSpec } from "@platform/app-spec";
import type { RenderFile } from "@platform/templates";
import { generateBackend } from "../backend/generateBackend";
import { generateFrontend } from "../frontend/generateFrontend";
import { generatePrisma } from "../database/generatePrisma";
import { generateAdmin } from "../admin/generateAdmin";
import { generateMobile } from "../mobile/generateMobile";

export function renderModuleFiles(spec: AppSpec): RenderFile[] {
  const files: RenderFile[] = [];
  files.push(...generatePrisma(spec));
  files.push(...generateBackend(spec));
  files.push(...generateFrontend(spec));

  if (spec.meta.targetPlatforms.includes("admin")) files.push(...generateAdmin(spec));
  if (spec.meta.targetPlatforms.includes("mobile")) files.push(...generateMobile(spec));

  return files;
}
