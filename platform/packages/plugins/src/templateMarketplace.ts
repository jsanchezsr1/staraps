export type MarketplaceTemplate = {
  key: string;
  name: string;
  slug: string;
  category: "crm" | "saas" | "marketplace" | "social" | "dashboard";
  version: string;
  description: string;
  tags: string[];
  thumbnailUrl?: string;
  templateSpecJson: Record<string, unknown>;
};

export const builtInMarketplaceTemplates: MarketplaceTemplate[] = [
  {
    key: "template.crm.starter",
    name: "CRM Starter",
    slug: "crm-starter",
    category: "crm",
    version: "1.0.0",
    description: "Starter CRM template with contacts, companies, and deals.",
    tags: ["crm", "sales", "dashboard"],
    templateSpecJson: {
      meta: {
        name: "CRM Starter",
        slug: "crm-starter",
        description: "Starter CRM app template",
        version: "1.0.0",
        targetPlatforms: ["web", "admin", "mobile"]
      },
      auth: { enabled: true, providers: ["email"], roles: ["owner", "admin", "sales"] },
      models: [
        {
          name: "Contact",
          fields: [
            { name: "firstName", type: "string", required: true },
            { name: "lastName", type: "string", required: true },
            { name: "email", type: "string", required: false, unique: true }
          ]
        },
        {
          name: "Company",
          fields: [
            { name: "name", type: "string", required: true },
            { name: "website", type: "string", required: false }
          ]
        },
        {
          name: "Deal",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "amount", type: "number", required: true },
            { name: "isOpen", type: "boolean", required: true }
          ]
        }
      ],
      pages: [],
      apis: []
    }
  },
  {
    key: "template.dashboard.starter",
    name: "Dashboard Starter",
    slug: "dashboard-starter",
    category: "dashboard",
    version: "1.0.0",
    description: "Starter analytics dashboard template.",
    tags: ["dashboard", "analytics", "charts"],
    templateSpecJson: {
      meta: {
        name: "Dashboard Starter",
        slug: "dashboard-starter",
        description: "Starter dashboard app template",
        version: "1.0.0",
        targetPlatforms: ["web", "admin"]
      },
      auth: { enabled: true, providers: ["email"], roles: ["owner", "admin", "viewer"] },
      models: [
        {
          name: "Metric",
          fields: [
            { name: "label", type: "string", required: true },
            { name: "value", type: "number", required: true },
            { name: "capturedAt", type: "date", required: true }
          ]
        }
      ],
      pages: [],
      apis: []
    }
  }
];

export function listMarketplaceTemplates(): MarketplaceTemplate[] {
  return builtInMarketplaceTemplates;
}

export function getMarketplaceTemplateByKey(key: string): MarketplaceTemplate | undefined {
  return builtInMarketplaceTemplates.find((template) => template.key === key);
}
