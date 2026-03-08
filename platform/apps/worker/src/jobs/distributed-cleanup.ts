import { cleanupExpiredPreviews } from "./preview-cleanup";

export async function runDistributedCleanup() {
  const previewResult = await cleanupExpiredPreviews();
  return {
    ok: true,
    previewCleanup: previewResult
  };
}
