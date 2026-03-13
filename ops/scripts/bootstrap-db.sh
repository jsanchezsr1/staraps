#!/usr/bin/env bash
set -euo pipefail

echo "Running database migrations..."
pnpm prisma migrate deploy

echo "Seeding database if needed..."
pnpm prisma db seed || true

echo "Database bootstrap complete."
