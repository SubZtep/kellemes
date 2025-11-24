FROM oven/bun:1.3.0-slim
ENV NODE_ENV=production
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/common/package.json ./packages/common/
COPY packages/vector-service/package.json ./packages/vector-service/
COPY packages/rag/package.json ./packages/rag/
COPY packages/api/package.json ./packages/api/

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY packages ./packages
COPY tsconfig.base.json ./

# Build packages (optional - Bun can run TypeScript directly)
# RUN pnpm build

CMD ["bun", "packages/api/src/index.ts"]
