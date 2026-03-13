export type CounterMetric = {
    name: string;
    value: number;
    labels?: Record<string, string>;
};
export declare function incrementCounter(name: string, labels?: Record<string, string>, by?: number): void;
export declare function readCounters(): CounterMetric[];
