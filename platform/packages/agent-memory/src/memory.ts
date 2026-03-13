<<<<<<< HEAD
export type MemoryRecord = {
  key?: string;
  value?: unknown;
  content?: string;
  metadata?: Record<string, unknown>;
};

export async function storeMemory(record: MemoryRecord): Promise<MemoryRecord> {
  return record;
=======
export async function storeMemory(record) {
  return {
    stored: true,
    record
  }
>>>>>>> 1e6f3bc09828941df8fa5837cc31adc361ae5090
}
