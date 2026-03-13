#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${ROOT_DIR}/platform"

echo "==> Checking prerequisites"
command -v docker >/dev/null 2>&1 || { echo "docker is required"; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "aws cli is required"; exit 1; }
command -v terraform >/dev/null 2>&1 || { echo "terraform is required"; exit 1; }

echo "==> Build images"
docker build -f "${ROOT_DIR}/ops/docker/web-platform.Dockerfile" -t platform-web:prod "${PROJECT_DIR}"
docker build -f "${ROOT_DIR}/ops/docker/api-platform.Dockerfile" -t platform-api:prod "${PROJECT_DIR}"
docker build -f "${ROOT_DIR}/ops/docker/worker.Dockerfile" -t platform-worker:prod "${PROJECT_DIR}"

echo "==> Terraform plan/apply"
cd "${ROOT_DIR}/ops/terraform/aws"
terraform init
terraform plan -out=tfplan
echo "Review the plan above, then run:"
echo "  terraform apply tfplan"

echo "==> Local production compose"
echo "To run locally with the production compose stack:"
echo "  docker compose -f ${ROOT_DIR}/ops/docker-compose.production.yml --env-file ${ROOT_DIR}/env/.env.production up -d"
