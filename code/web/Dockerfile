ARG API_URL

FROM node:18-slim as builder

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

COPY . .

RUN VITE_API_URL=https://localhost:8080/api/v1 pnpm build

FROM caddy:2-alpine

COPY --from=builder /app/dist /usr/share/caddy/html
