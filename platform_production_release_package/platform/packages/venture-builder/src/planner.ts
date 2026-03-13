import type { VentureAppSpecDraft, VentureBuildPlan, VentureLaunchHandoff } from "./types";

export async function createVentureBuildPlan(input: {
  ventureName: string;
  marketCategory?: string;
}) : Promise<VentureBuildPlan> {
  return {
    productName: input.ventureName,
    category: input.marketCategory || "workflow automation",
    targetCustomer: "SMB operators and operations-heavy teams",
    primaryWorkflow: "Capture requests, automate actions, and track outcomes",
    monetizationModel: "subscription",
    payloadJson: { source: "venture_builder" }
  };
}

export async function generateVentureAppSpec(input: {
  plan: VentureBuildPlan;
}) : Promise<VentureAppSpecDraft> {
  return {
    meta: {
      name: input.plan.productName,
      slug: input.plan.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      category: input.plan.category
    },
    models: [
      { name: "Account", fields: ["name", "email", "status"] },
      { name: "WorkflowItem", fields: ["title", "state", "ownerId"] }
    ],
    pages: [
      { name: "Dashboard", path: "/" },
      { name: "Accounts", path: "/accounts" },
      { name: "Workflow", path: "/workflow" }
    ],
    apis: [
      { name: "listAccounts", method: "GET", path: "/api/accounts" },
      { name: "listWorkflowItems", method: "GET", path: "/api/workflow-items" }
    ]
  };
}

export async function createLaunchHandoff(input: {
  plan: VentureBuildPlan;
  spec: VentureAppSpecDraft;
}) : Promise<VentureLaunchHandoff> {
  return {
    readiness: "generator_ready",
    summary: `Spec for ${input.plan.productName} is ready for generator handoff.`,
    nextActions: [
      "Create project from venture spec",
      "Trigger autonomous builder",
      "Provision preview deployment"
    ]
  };
}
