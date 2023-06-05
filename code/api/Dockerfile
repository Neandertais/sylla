FROM node:18-slim as base
RUN npm i -g pnpm


# Install dependecies
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

# Build for production
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN node ace build --production


# Development container
FROM base AS development
RUN apt-get update && \
  apt-get install tini -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*
ENTRYPOINT [ "tini", "--" ]

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE $PORT

CMD [ "node", "ace", "serve", "--watch" ]


# Production container
FROM base AS production
RUN apt-get update && \
  apt-get install tini -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*
ENTRYPOINT [ "tini", "--" ]

WORKDIR /app

ENV NODE_ENV production
ENV PORT $PORT
ENV HOST 0.0.0.0

COPY --from=deps /app/package.json /app/yarn.lock ./
COPY --from=builder /app/build .

RUN pnpm i --frozen-lockfile --prod

EXPOSE $PORT

CMD [ "node", "server.js" ]
