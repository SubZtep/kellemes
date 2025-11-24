FROM oven/bun:1.3.3-slim
ENV NODE_ENV=production
WORKDIR /app
RUN bun install pnpm@10.23.0 --global

COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts

CMD ["bun", "packages/api/src/index.ts", "--console"]
