import type { PlatformPluginHooks } from "./hooks";

export type PlatformPluginManifest = {
  key: string;
  name: string;
  version: string;
  type: "generator" | "deployment" | "integration" | "ui";
  description: string;
  author?: string;
  homepage?: string;
  configSchema?: Record<string, unknown>;
};

export type PlatformPluginModule = {
  manifest: PlatformPluginManifest;
  hooks?: PlatformPluginHooks;
};

export function definePlatformPlugin(module: PlatformPluginModule): PlatformPluginModule {
  return module;
}
