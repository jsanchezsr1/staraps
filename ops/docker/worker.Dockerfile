FROM node:20-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS build
WORKDIR /app
ENV NODE_ENV=production
RUN pnpm --filter worker build || true

FROM node:20-alpine AS runner
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app /app
CMD ["sh", "-c", "pnpm --filter worker start"]
