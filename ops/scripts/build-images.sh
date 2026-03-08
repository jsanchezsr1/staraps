#!/usr/bin/env bash
set -euo pipefail

docker build -f ops/docker/web-platform.Dockerfile -t platform-web:prod .
docker build -f ops/docker/api-platform.Dockerfile -t platform-api:prod .
docker build -f ops/docker/worker.Dockerfile -t platform-worker:prod .
