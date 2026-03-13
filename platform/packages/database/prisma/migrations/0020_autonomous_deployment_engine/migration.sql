CREATE TABLE "DeploymentEnvironment" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "environmentType" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "url" TEXT,
  "runtimeRegionId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DeploymentPlan" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "environmentType" TEXT NOT NULL,
  "planJson" JSONB NOT NULL,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DeploymentRun" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "projectVersionId" TEXT,
  "deploymentPlanId" TEXT,
  "deploymentEnvironmentId" TEXT,
  "requestedByUserId" TEXT,
  "status" TEXT NOT NULL,
  "resultJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP,
  "finishedAt" TIMESTAMP
);

CREATE TABLE "DeploymentOptimization" (
  "id" TEXT PRIMARY KEY,
  "deploymentRunId" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "payloadJson" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "DeploymentEnvironment_project_createdAt_idx"
  ON "DeploymentEnvironment"("projectId", "createdAt");

CREATE INDEX "DeploymentPlan_project_createdAt_idx"
  ON "DeploymentPlan"("projectId", "createdAt");

CREATE INDEX "DeploymentRun_project_createdAt_idx"
  ON "DeploymentRun"("projectId", "createdAt");

CREATE INDEX "DeploymentOptimization_run_createdAt_idx"
  ON "DeploymentOptimization"("deploymentRunId", "createdAt");

ALTER TABLE "DeploymentEnvironment"
  ADD CONSTRAINT "DeploymentEnvironment_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeploymentEnvironment"
  ADD CONSTRAINT "DeploymentEnvironment_runtimeRegionId_fkey"
  FOREIGN KEY ("runtimeRegionId") REFERENCES "RuntimeRegion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DeploymentPlan"
  ADD CONSTRAINT "DeploymentPlan_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeploymentPlan"
  ADD CONSTRAINT "DeploymentPlan_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DeploymentPlan"
  ADD CONSTRAINT "DeploymentPlan_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DeploymentRun"
  ADD CONSTRAINT "DeploymentRun_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeploymentRun"
  ADD CONSTRAINT "DeploymentRun_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DeploymentRun"
  ADD CONSTRAINT "DeploymentRun_deploymentPlanId_fkey"
  FOREIGN KEY ("deploymentPlanId") REFERENCES "DeploymentPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DeploymentRun"
  ADD CONSTRAINT "DeploymentRun_deploymentEnvironmentId_fkey"
  FOREIGN KEY ("deploymentEnvironmentId") REFERENCES "DeploymentEnvironment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DeploymentRun"
  ADD CONSTRAINT "DeploymentRun_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DeploymentOptimization"
  ADD CONSTRAINT "DeploymentOptimization_deploymentRunId_fkey"
  FOREIGN KEY ("deploymentRunId") REFERENCES "DeploymentRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
