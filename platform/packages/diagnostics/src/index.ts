export type GenerationDiagnostic = {
  level: "info" | "warn" | "error";
  source: "generator" | "template" | "plugin" | "worker";
  message: string;
  filePath?: string;
  stack?: string;
  timestamp: string;
};

export function makeDiagnostic(input: Omit<GenerationDiagnostic, "timestamp">): GenerationDiagnostic {
  return {
    ...input,
    timestamp: new Date().toISOString()
  };
}
