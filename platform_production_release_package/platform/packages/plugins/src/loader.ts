import type { PlatformPluginManifest, PlatformPluginModule } from "./sdk";

const externalPluginRegistry = new Map<string, PlatformPluginModule>();

export function registerExternalPlugin(module: PlatformPluginModule) {
  externalPluginRegistry.set(module.manifest.key, module);
}

export function listExternalPluginManifests(): PlatformPluginManifest[] {
  return Array.from(externalPluginRegistry.values()).map((module) => module.manifest);
}

export function getExternalPlugin(key: string): PlatformPluginModule | undefined {
  return externalPluginRegistry.get(key);
}
