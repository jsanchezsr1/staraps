export type CounterMetric = {
  name: string;
  value: number;
  labels?: Record<string, string>;
};

const counters = new Map<string, number>();

function key(name: string, labels?: Record<string, string>): string {
  return JSON.stringify({ name, labels: labels || {} });
}

export function incrementCounter(name: string, labels?: Record<string, string>, by = 1) {
  const k = key(name, labels);
  counters.set(k, (counters.get(k) || 0) + by);
}

export function readCounters(): CounterMetric[] {
  return Array.from(counters.entries()).map(([k, value]) => {
    const parsed = JSON.parse(k);
    return { name: parsed.name, labels: parsed.labels, value };
  });
}
