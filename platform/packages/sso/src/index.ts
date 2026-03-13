export type SSOProviderType = "saml" | "oidc";

export type SSOConfig = {
  organizationId: string;
  providerType: SSOProviderType;
  entryPoint?: string;
  issuer?: string;
  audience?: string;
  certificate?: string;
};
