export type LogLevel = "debug" | "info" | "warn" | "error";

export type StructuredLogEntry = {
  level: LogLevel;
  message: string;
  service?: string;
  event?: string;
  timestamp: string;
  context?: Record<string, unknown>;
};

function emit(entry: StructuredLogEntry) {
  const line = JSON.stringify(entry);
  if (entry.level === "error") {
    console.error(line);
  } else if (entry.level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const structuredLogger = {
  debug(message: string, context?: Record<string, unknown>, service?: string, event?: string) {
    emit({ level: "debug", message, context, service, event, timestamp: new Date().toISOString() });
  },
  info(message: string, context?: Record<string, unknown>, service?: string, event?: string) {
    emit({ level: "info", message, context, service, event, timestamp: new Date().toISOString() });
  },
  warn(message: string, context?: Record<string, unknown>, service?: string, event?: string) {
    emit({ level: "warn", message, context, service, event, timestamp: new Date().toISOString() });
  },
  error(message: string, context?: Record<string, unknown>, service?: string, event?: string) {
    emit({ level: "error", message, context, service, event, timestamp: new Date().toISOString() });
  }
};
