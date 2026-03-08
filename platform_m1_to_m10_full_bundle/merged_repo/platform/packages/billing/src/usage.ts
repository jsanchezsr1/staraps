import { randomUUID } from "crypto";
import { usageRecordsRepository } from "@platform/database";

export async function recordUsage(input: {
  organizationId: string;
  projectId?: string;
  metricKey: string;
  quantity: number;
  unit: string;
  metadataJson?: unknown;
}) {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return usageRecordsRepository.create({
    id: randomUUID(),
    organizationId: input.organizationId,
    projectId: input.projectId || null,
    metricKey: input.metricKey,
    quantity: input.quantity,
    unit: input.unit,
    periodStart,
    periodEnd,
    metadataJson: input.metadataJson
  });
}
