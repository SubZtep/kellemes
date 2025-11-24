FROM oven/bun:1.3.3-slim
ENV NODE_ENV=production
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts

CMD ["bun", "packages/api/src/index.ts", "--console"]
