import { builtInPlugins } from "./index";
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
}
