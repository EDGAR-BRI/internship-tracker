FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/back/package.json packages/back/
COPY packages/front/package.json packages/front/
RUN pnpm install --frozen-lockfile
COPY packages/back/ packages/back/
COPY packages/front/ packages/front/
WORKDIR /app/packages/back
RUN node ace build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/back/build ./
COPY --from=builder /app/packages/back/node_modules ./node_modules
EXPOSE 3333
RUN printf '#!/bin/sh\nset -e\necho "Running migrations..."\nnode ace migration:run --force\necho "Starting server..."\nexec node bin/server.js\n' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh
CMD ["sh", "/app/entrypoint.sh"]
