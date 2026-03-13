export type ScimProvisioningEventType =
  | "user.created"
  | "user.updated"
  | "user.deactivated"
  | "group.updated";

export type ScimProvisioningEvent = {
  organizationId: string;
  eventType: ScimProvisioningEventType;
  payloadJson: Record<string, unknown>;
};
