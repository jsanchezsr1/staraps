import type { AppSpec } from "@platform/app-spec";

export type BuildPlan = {
  modules: Array<"frontend" | "backend" | "database" | "admin" | "mobile">;
  modelCount: number;
  pageCount: number;
  apiCount: number;
};

export function buildPlan(spec: AppSpec): BuildPlan {
  const modules = ["frontend", "backend", "database"] as BuildPlan["modules"];
  if (spec.meta.targetPlatforms.includes("admin")) modules.push("admin");
  if (spec.meta.targetPlatforms.includes("mobile")) modules.push("mobile");
  return { modules, modelCount: spec.models.length, pageCount: spec.pages.length, apiCount: spec.apis.length };
}
