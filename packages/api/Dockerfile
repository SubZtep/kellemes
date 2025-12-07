FROM oven/bun:1.3.4-slim
ENV NODE_ENV=production
WORKDIR /app
RUN bun install pnpm@10.23.0 --global

COPY . .
RUN pnpm i --ignore-scripts
RUN pnpm build

CMD ["bun", "packages/api/src/index.ts", "--console"]
