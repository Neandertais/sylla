FROM node:18-alpine as base
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
RUN apk --no-cache add tini
ENTRYPOINT [ "tini" ]

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE $PORT

CMD [ "node", "ace", "serve", "--watch" ]


# Production container
FROM base AS production
RUN apk --no-cache add tini
ENTRYPOINT [ "tini" ]

WORKDIR /app

ENV NODE_ENV production
ENV PORT $PORT
ENV HOST 0.0.0.0

COPY --from=deps /app/package.json /app/yarn.lock ./
COPY --from=builder /app/build .

RUN pnpm i --frozen-lockfile --prod

EXPOSE $PORT

CMD [ "node", "server.js" ]
