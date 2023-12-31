FROM docker.io/library/node:lts-alpine AS base

# Prepare work directory
WORKDIR /inprove

FROM base AS builder

# Prepare pnpm https://pnpm.io/installation#using-corepack
RUN corepack enable

# Prepare deps
RUN apk update
RUN apk add git --no-cache

# Prepare build deps ( ignore postinstall scripts for now )
COPY .npmrc ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copy all source files
COPY . ./

# Run full install with every postinstall script ( This needs project file )
RUN pnpm i --frozen-lockfile

# Build
RUN pnpm build

FROM base AS runner

ARG UID=911
ARG GID=911

# Create a dedicated user and group
RUN set -eux; \
    addgroup -g $GID inprove; \
    adduser -u $UID -D -G inprove inprove;

USER inprove

ENV NODE_ENV=production

COPY --from=builder /inprove/.output ./.output

EXPOSE 3000/tcp

ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
