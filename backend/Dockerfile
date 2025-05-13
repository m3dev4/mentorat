FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Supprimez cette ligne si les tests sont exécutés dans le pipeline CI
# RUN npm run test

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --production

COPY --from=builder /app/src ./src

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "src/server.js"]