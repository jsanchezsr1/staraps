import { makeHealthReport } from "@platform/shared/health";

export function workerHealthReport() {
  return makeHealthReport({
    service: "worker",
    status: "ok",
    checks: [
      { name: "generation-worker", status: "ok" },
      { name: "preview-worker", status: "ok" },
      { name: "deployment-worker", status: "ok" }
    ]
  });
}
