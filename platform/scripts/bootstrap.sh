#!/usr/bin/env bash
set -euo pipefail
cp -n .env.example .env || true
docker compose up -d
pnpm install
pnpm --filter @platform/database prisma:generate
pnpm --filter @platform/database prisma:migrate
echo "Bootstrap complete."
