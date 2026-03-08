export type WebhookEvent =
  | "project.created"
  | "project.generated"
  | "deployment.created"
  | "plugin.installed";

export type WebhookDefinition = {
  id: string;
  organizationId: string;
  url: string;
  event: WebhookEvent;
};
