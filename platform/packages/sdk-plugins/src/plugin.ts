export interface PlatformPlugin {
  name: string;
  version: string;
  permissions: string[];
  init(): Promise<void>;
}
