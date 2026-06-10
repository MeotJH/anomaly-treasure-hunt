FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm ci

COPY apps/api ./apps/api

RUN npm run build:api

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/prisma ./apps/api/prisma

RUN npm ci --omit=dev

WORKDIR /app/apps/api
RUN DATABASE_URL="file:/app/apps/api/.local/anomaly-treasure-hunt.sqlite" ./node_modules/.bin/prisma generate --schema prisma/schema.prisma

COPY --from=build /app/apps/api/dist ./dist

EXPOSE 4000

CMD ["node", "dist/main.js"]
