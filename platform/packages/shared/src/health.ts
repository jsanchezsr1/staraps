export type HealthStatus = "ok" | "degraded" | "down";

export type ServiceHealth = {
  service: string;
  status: HealthStatus;
  checks: Array<{
    name: string;
    status: HealthStatus;
    details?: string;
  }>;
  timestamp: string;
};

export function makeHealthReport(input: Omit<ServiceHealth, "timestamp">): ServiceHealth {
  return {
    ...input,
    timestamp: new Date().toISOString()
  };
}
