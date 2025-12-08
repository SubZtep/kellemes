FROM debian:trixie-20251117-slim

RUN apt-get update  \
  && apt-get -y --no-install-recommends install  \
  # install any other dependencies you might need
  sudo curl git ca-certificates build-essential \
  && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV PATH="/mise/shims:$PATH"
# ENV MISE_VERSION="..."

RUN curl https://mise.run | sh
WORKDIR /app
COPY . .
RUN mise trust
RUN mise install
# RUN mise install python
# RUN pnpm install --frozen-lockfile --ignore-scripts
RUN mise build
CMD ["bun", "packages/api/src/index.ts", "--console"]

# # FROM oven/bun:1.3.4-slim
# FROM oven/bun:latest
# ENV NODE_ENV=production
# WORKDIR /app
# # RUN bun install pnpm@10.23.0 --global
# RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

# COPY . .
# RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm build

# CMD ["bun", "packages/api/src/index.ts", "--console"]
# # Builder stage
# FROM oven/bun:latest AS builder
# ENV NODE_ENV=production
# WORKDIR /app
# RUN bun install pnpm@10.23.0 --global

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# COPY packages/common/package.json ./packages/common/
# COPY packages/rag/package.json ./packages/rag/
# COPY packages/api/package.json ./packages/api/

# RUN pnpm install --frozen-lockfile --ignore-scripts --reporter=append-only

# COPY packages/common ./packages/common
# COPY packages/rag ./packages/rag

# RUN pnpm --filter @kellemes/common build
# RUN pnpm --filter @kellemes/rag build

# FROM oven/bun:latest
# ENV NODE_ENV=production
# WORKDIR /app
# RUN bun install pnpm@10.23.0 --global

# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# COPY packages/common/package.json ./packages/common/
# COPY packages/rag/package.json ./packages/rag/
# COPY packages/api/package.json ./packages/api/

# RUN pnpm install --frozen-lockfile --ignore-scripts --prod --reporter=append-only

# COPY --from=builder /app/packages/common/dist ./packages/common/dist
# COPY --from=builder /app/packages/common/package.json ./packages/common/package.json
# COPY --from=builder /app/packages/rag/dist ./packages/rag/dist
# COPY --from=builder /app/packages/rag/package.json ./packages/rag/package.json

# COPY packages/api ./packages/api

# CMD ["bun", "packages/api/src/index.ts", "--console"]
