import { builtInPlugins } from "./index";
<<<<<<< HEAD
import type { PlatformPlugin } from "./types";

export function getRuntimePlugins(): PlatformPlugin[] {
  return builtInPlugins;
=======
import type { PlatformPluginHooks, PluginExecutionContext } from "./hooks";

const hookRegistry = new Map<string, PlatformPluginHooks>();

export function registerPluginHooks(key: string, hooks: PlatformPluginHooks) {
  hookRegistry.set(key, hooks);
}

export async function runPluginHook(
  stage: keyof PlatformPluginHooks,
  context: PluginExecutionContext
): Promise<void> {
  for (const plugin of builtInPlugins) {
    const hooks = hookRegistry.get(plugin.key);
    const fn = hooks?.[stage];
    if (typeof fn === "function") {
      await fn(context);
    }
  }
>>>>>>> 1e6f3bc09828941df8fa5837cc31adc361ae5090
}
