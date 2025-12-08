FROM oven/bun:latest

WORKDIR /app

# Copy workspace root files
COPY package.json bun.lock* ./

# Copy all packages
COPY packages/common ./packages/common
COPY packages/api ./packages/api

# Install dependencies
RUN bun install

# Build common package (api depends on it)
RUN bun run --filter @kellemes/common build

ENV NODE_ENV=production

# Run API
CMD ["bun", "run", "--filter", "@kellemes/api", "start"]
