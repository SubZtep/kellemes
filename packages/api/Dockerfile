FROM node:24.11.1-bookworm-slim
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
WORKDIR /app
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# COPY packages ./packages
COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm build
# WORKDIR /app/packages/api

# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["pnpm", "--filter", "@kellemes/api", "start"]
