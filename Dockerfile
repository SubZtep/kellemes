# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/ollama-service/package.json ./packages/ollama-service/
COPY packages/vector-service/package.json ./packages/vector-service/
COPY packages/rag-service/package.json ./packages/rag-service/
COPY packages/core/package.json ./packages/core/
COPY packages/api/package.json ./packages/api/

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY tsconfig.base.json ./
COPY packages ./packages

# Build only API and its dependencies (not CLI)
RUN pnpm --filter @kellemes/api... build

# Production stage
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/ollama-service/package.json ./packages/ollama-service/
COPY packages/vector-service/package.json ./packages/vector-service/
COPY packages/rag-service/package.json ./packages/rag-service/
COPY packages/core/package.json ./packages/core/
COPY packages/api/package.json ./packages/api/

# Install production dependencies + tsx for running TypeScript
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy built artifacts from builder (including all subdirectories)
COPY --from=builder /app/packages/types/ ./packages/types/
COPY --from=builder /app/packages/ollama-service/ ./packages/ollama-service/
COPY --from=builder /app/packages/vector-service/ ./packages/vector-service/
COPY --from=builder /app/packages/rag-service/ ./packages/rag-service/
COPY --from=builder /app/packages/core/ ./packages/core/
COPY --from=builder /app/packages/api/ ./packages/api/

# Copy data directory structure
RUN mkdir -p /app/data/vectors /app/data/training

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the API server using tsx (handles ESM imports properly)
CMD ["pnpm", "exec", "tsx", "packages/api/src/index.ts"]
