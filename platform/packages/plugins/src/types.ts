export type PlatformPlugin = {
  id: string;
  name: string;
  version: string;
  enabled?: boolean;
  metadata?: Record<string, unknown>;
};
