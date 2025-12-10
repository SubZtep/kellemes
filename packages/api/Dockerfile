# Builder stage
FROM oven/bun:1.3.4-slim AS builder
ENV NODE_ENV=production
WORKDIR /app
RUN bun install pnpm@10.23.0 --global

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/common/package.json ./packages/common/
COPY packages/rag/package.json ./packages/rag/
COPY packages/api/package.json ./packages/api/

RUN pnpm install --frozen-lockfile --reporter=append-only

COPY packages/common ./packages/common
COPY packages/rag ./packages/rag

RUN pnpm --filter @kellemes/common build
RUN pnpm --filter @kellemes/rag build

FROM oven/bun:1.3.4-slim
ENV NODE_ENV=production
WORKDIR /app
RUN bun install pnpm@10.23.0 --global

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/common/package.json ./packages/common/
COPY packages/rag/package.json ./packages/rag/
COPY packages/api/package.json ./packages/api/

RUN pnpm install --frozen-lockfile --prod --reporter=append-only

COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/common/package.json ./packages/common/package.json
COPY --from=builder /app/packages/rag/dist ./packages/rag/dist
COPY --from=builder /app/packages/rag/package.json ./packages/rag/package.json

COPY packages/api ./packages/api

CMD ["bun", "packages/api/src/index.ts", "--console"]
