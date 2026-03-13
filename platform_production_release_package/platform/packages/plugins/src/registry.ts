import type { PlatformPlugin } from "./types";

export const builtInPlugins: PlatformPlugin[] = [];

export function getBuiltInPlugins(): PlatformPlugin[] {
  return builtInPlugins;
}
