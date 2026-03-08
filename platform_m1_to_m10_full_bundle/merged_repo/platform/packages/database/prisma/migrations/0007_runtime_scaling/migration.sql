CREATE TABLE "PreviewRouting" (
  "id" TEXT PRIMARY KEY,
  "previewEnvironmentId" TEXT NOT NULL UNIQUE,
  "hostname" TEXT NOT NULL,
  "pathPrefix" TEXT,
  "targetHost" TEXT NOT NULL,
  "targetPort" INTEGER NOT NULL,
  "provider" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "PreviewRouting_hostname_idx"
  ON "PreviewRouting"("hostname");

ALTER TABLE "PreviewRouting"
  ADD CONSTRAINT "PreviewRouting_previewEnvironmentId_fkey"
  FOREIGN KEY ("previewEnvironmentId") REFERENCES "PreviewEnvironment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
