const DEFAULT_BASE_PORT = 4100;

export function allocatePreviewPort(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  return DEFAULT_BASE_PORT + hash;
}
