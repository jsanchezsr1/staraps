export type PluginExecutionContext = {
  organizationId?: string;
  projectId?: string;
  versionId?: string;
  target?: string;
  metadata?: Record<string, unknown>;
};

export type GeneratorPluginHook = {
  beforeGenerate?: (context: PluginExecutionContext) => Promise<void> | void;
  afterGenerate?: (context: PluginExecutionContext) => Promise<void> | void;
};

export type DeploymentPluginHook = {
  beforeDeploy?: (context: PluginExecutionContext) => Promise<void> | void;
  afterDeploy?: (context: PluginExecutionContext) => Promise<void> | void;
};

export type IntegrationPluginHook = {
  beforePreview?: (context: PluginExecutionContext) => Promise<void> | void;
  afterPreview?: (context: PluginExecutionContext) => Promise<void> | void;
};

export type PlatformPluginHooks = GeneratorPluginHook & DeploymentPluginHook & IntegrationPluginHook;
