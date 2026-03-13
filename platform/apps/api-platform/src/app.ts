import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
<<<<<<< HEAD
import express, { Express } from "express";
=======
import express from "express";
>>>>>>> 1e6f3bc09828941df8fa5837cc31adc361ae5090
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerAuthRoutes } from "./modules/auth/routes";
import { registerOrganizationRoutes } from "./modules/organizations/routes";
import { registerProjectRoutes } from "./modules/projects/routes";
import { registerVersionRoutes } from "./modules/versions/routes";
import { registerJobRoutes } from "./modules/jobs/routes";
import { registerPlatformRoutes } from "./modules/platform/routes";
import { registerMarketplaceRoutes } from "./modules/marketplace/routes";
import { registerOpsRoutes } from "./modules/ops/routes";
import { registerRuntimeRoutes } from "./modules/runtime/routes";
import { registerBillingRoutes } from "./modules/billing/routes";
import { registerWorkspaceRoutes } from "./modules/workspace/routes";
import { registerDiagnosticsRoutes } from "./modules/diagnostics/routes";
import { registerPluginMarketplaceRoutes } from "./modules/plugins/routes";
import { registerAIRoutes } from "./modules/ai/routes";
import { registerDeveloperRoutes } from "./modules/developer/routes";
import { registerCollaborationRoutes } from "./modules/collaboration/routes";
import { registerCopilotRoutes } from "./modules/copilot/routes";
import { registerEnterpriseRoutes } from "./modules/enterprise/routes";
import { registerMonetizationRoutes } from "./modules/monetization/routes";
import { registerGlobalScaleRoutes } from "./modules/global-scale/routes";
import { registerAutonomousBuilderRoutes } from "./modules/autonomous-builder/routes";
import { registerVisualBuilderRoutes } from "./modules/visual-builder/routes";
import { registerBuilderSyncRoutes } from "./modules/builder-sync/routes";
import { registerAutoRepairRoutes } from "./modules/auto-repair/routes";
import { registerAutonomousIterationRoutes } from "./modules/autonomous-iteration/routes";
import { registerAutonomousDeploymentRoutes } from "./modules/autonomous-deployment/routes";
import { registerAgentRoutes } from "./modules/agents/routes";
import { registerToolAgentRoutes } from "./modules/tool-agents/routes";
import { registerWorkflowAgentRoutes } from "./modules/workflow-agents/routes";
import { registerPromptRegistryRoutes } from "./modules/prompt-registry/routes";
import { registerModelRouterRoutes } from "./modules/model-router/routes";
import { registerProductIntelligenceRoutes } from "./modules/product-intelligence/routes";
import { registerExperimentationRoutes } from "./modules/experimentation/routes";
import { registerProductOptimizerRoutes } from "./modules/product-optimizer/routes";
import { registerMarketDiscoveryRoutes } from "./modules/market-discovery/routes";
import { registerGrowthEngineRoutes } from "./modules/growth-engine/routes";
import { registerVentureStudioRoutes } from "./modules/venture-studio/routes";
import { registerPortfolioOpsRoutes } from "./modules/portfolio-ops/routes";
import { registerVentureBuilderRoutes } from "./modules/venture-builder/routes";
import { registerLaunchEngineRoutes } from "./modules/launch-engine/routes";
import { registerVentureAutopilotRoutes } from "./modules/venture-autopilot/routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";

<<<<<<< HEAD
export function createApp(): Express {
  const app = express();

=======
export function createApp() {
  const app = express();
>>>>>>> 1e6f3bc09828941df8fa5837cc31adc361ae5090
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
<<<<<<< HEAD

  app.get("/api/health", (_req, res) => res.json({ ok: true, service: "api-platform" }));
  app.get("/api/readiness", (_req, res) => res.json({ ok: true, readiness: "ready" }));

=======
  app.get("/api/health", (_req, res) => res.json({ ok: true, service: "api-platform" }));
  app.get("/api/readiness", (_req, res) => res.json({ ok: true, readiness: "ready" }));
>>>>>>> 1e6f3bc09828941df8fa5837cc31adc361ae5090
  registerAuthRoutes(app);
  registerOrganizationRoutes(app);
  registerProjectRoutes(app);
  registerVersionRoutes(app);
  registerJobRoutes(app);
  registerPlatformRoutes(app);
  registerMarketplaceRoutes(app);
  registerOpsRoutes(app);
  registerRuntimeRoutes(app);
  registerBillingRoutes(app);
  registerWorkspaceRoutes(app);
  registerDiagnosticsRoutes(app);
  registerPluginMarketplaceRoutes(app);
  registerAIRoutes(app);
  registerDeveloperRoutes(app);
  registerCollaborationRoutes(app);
  registerCopilotRoutes(app);
  registerEnterpriseRoutes(app);
  registerMonetizationRoutes(app);
  registerGlobalScaleRoutes(app);
  registerAutonomousBuilderRoutes(app);
  registerVisualBuilderRoutes(app);
  registerBuilderSyncRoutes(app);
  registerAutoRepairRoutes(app);
  registerAutonomousIterationRoutes(app);
  registerAutonomousDeploymentRoutes(app);
  registerAgentRoutes(app);
  registerToolAgentRoutes(app);
  registerWorkflowAgentRoutes(app);
  registerPromptRegistryRoutes(app);
  registerModelRouterRoutes(app);
  registerProductIntelligenceRoutes(app);
  registerExperimentationRoutes(app);
  registerProductOptimizerRoutes(app);
  registerMarketDiscoveryRoutes(app);
  registerGrowthEngineRoutes(app);
  registerVentureStudioRoutes(app);
  registerPortfolioOpsRoutes(app);
  registerVentureBuilderRoutes(app);
  registerLaunchEngineRoutes(app);
  registerVentureAutopilotRoutes(app);
<<<<<<< HEAD

=======
>>>>>>> 1e6f3bc09828941df8fa5837cc31adc361ae5090
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
