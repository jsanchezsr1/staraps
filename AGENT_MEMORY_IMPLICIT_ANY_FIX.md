Fixed the TypeScript noImplicitAny error in `packages/agent-memory/src/memory.ts` by typing the `record` parameter as `Record<string, unknown>` and exporting a local `MemoryRecord` alias.
