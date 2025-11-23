FROM node:24.11.1-trixie-slim
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm build

CMD ["pnpm", "--filter", "@kellemes/api", "start"]
