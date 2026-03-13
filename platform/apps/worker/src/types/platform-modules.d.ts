declare module "@platform/shared" {
  export const env: any;
  export const structuredLogger: any;
  export const incrementCounter: any;
  export const makeHealthReport: any;
  export const parseEnv: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/shared/env" {
  export const parseEnv: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/shared/health" {
  export const makeHealthReport: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/database" {
  export const platformJobsRepository: any;
  export const previewEnvironmentsRepository: any;
  export const previewRoutingRepository: any;
  export const generationJobsRepository: any;
  export const organizationsRepository: any;
  export const projectsRepository: any;
  export const projectVersionsRepository: any;
  export const refreshTokensRepository: any;
  export const planDefinitionsRepository: any;
  export const usageRecordsRepository: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/generator" {
  export const generateApp: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/plugins/runtime" {
  export const runPluginHook: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/runtime" {
  export const AwsEcsDeploymentProvider: any;
  export const KubernetesDeploymentProvider: any;
  export const AwsEcsPreviewProvider: any;
  export const KubernetesPreviewProvider: any;
  export const EcrRegistryProvider: any;
  export const LocalImageRegistryProvider: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/storage" {
  export const makeStorageProvider: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/billing" {
  export const recordUsage: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/ai-builder" {
  export const generateSpecFromPrompt: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module "@platform/ai-builder/dist/llm/openaiAdapter" {
  export class OpenAIAdapter {
    constructor(...args: any[]);
  }
}
