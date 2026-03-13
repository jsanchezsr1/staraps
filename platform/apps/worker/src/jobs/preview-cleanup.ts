import { previewEnvironmentsRepository } from "@platform/database";
import { stopPreviewEnvironment } from "../runtime/previewLifecycle";

export async function cleanupExpiredPreviews() {
  const expired = await previewEnvironmentsRepository.listExpired();
  let stopped = 0;

  for (const env of expired) {
    try {
      await stopPreviewEnvironment({ previewEnvironmentId: env.id });
      stopped += 1;
    } catch {
      // best-effort cleanup scaffold
    }
  }

  return { stopped };
}
