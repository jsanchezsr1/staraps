#!/usr/bin/env bash
set -euo pipefail
docker compose down -v || true
rm -rf node_modules
find . -name dist -type d -prune -exec rm -rf {} +
find . -name .next -type d -prune -exec rm -rf {} +
docker compose up -d
pnpm install
pnpm --filter @platform/database prisma:generate
pnpm --filter @platform/database prisma:migrate
echo "Dev environment reset."
