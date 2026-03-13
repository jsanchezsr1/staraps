import { builtInPlugins } from "./index";
import type { PlatformPlugin } from "./types";

export function getRuntimePlugins(): PlatformPlugin[] {
  return builtInPlugins;
}
