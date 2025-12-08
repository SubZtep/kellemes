FROM oven/bun:debian

WORKDIR /app

# Copy workspace root files
COPY tsconfig.base.json package.json bun.lock* ./

# Copy all packages
COPY packages/common ./packages/common
COPY packages/api ./packages/api

# Install dependencies
RUN bun install --ignore-scripts

# Build common package (api depends on it)
RUN bun run --filter @kellemes/common build

ENV NODE_ENV=production

# Run API
CMD ["bun", "run", "--filter", "@kellemes/api", "start"]
