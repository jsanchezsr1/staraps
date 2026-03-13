export type LogLevel = "debug" | "info" | "warn" | "error";
export type StructuredLogEntry = {
    level: LogLevel;
    message: string;
    service?: string;
    event?: string;
    timestamp: string;
    context?: Record<string, unknown>;
};
export declare const structuredLogger: {
    debug(message: string, context?: Record<string, unknown>, service?: string, event?: string): void;
    info(message: string, context?: Record<string, unknown>, service?: string, event?: string): void;
    warn(message: string, context?: Record<string, unknown>, service?: string, event?: string): void;
    error(message: string, context?: Record<string, unknown>, service?: string, event?: string): void;
};
