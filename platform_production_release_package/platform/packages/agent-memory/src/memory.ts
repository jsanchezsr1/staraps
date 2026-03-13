export type MemoryRecord = {
  key?: string;
  value?: unknown;
  content?: string;
  metadata?: Record<string, unknown>;
};

export async function storeMemory(record: MemoryRecord): Promise<MemoryRecord> {
  return record;
}
