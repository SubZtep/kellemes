FROM oven/bun:latest
ENV NODE_ENV=production
WORKDIR /app
RUN bun install pnpm@10.24.0 --global

COPY . .
RUN pnpm i --ignore-scripts
RUN pnpm build

CMD ["bun", "packages/api/src/index.ts", "--console"]
