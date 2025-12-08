FROM oven/bun:latest

WORKDIR /app
COPY . .
RUN bun install
# RUN bun x @better-auth/cli@latest generate
CMD ["bun", "packages/api/src/index.ts"]


# # Copy workspace files
# COPY package.json bun.lockb* ./
# COPY packages/common/package.json ./packages/common/
# COPY packages/rag/package.json ./packages/rag/
# COPY packages/api/package.json ./packages/api/

# # Install dependencies

# RUN bun install

# # Copy source code
# COPY packages/common ./packages/common
# COPY packages/rag ./packages/rag
# COPY packages/api ./packages/api

# # Build packages that need building
# RUN bun run --filter @kellemes/common build || true
# RUN bun run --filter @kellemes/rag build || true

# Run API (env vars provided by docker-compose)
# CMD ["bun", "packages/api/src/index.ts"]
