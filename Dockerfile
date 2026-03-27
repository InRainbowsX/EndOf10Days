# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

FROM base AS test
ENV CI=true
CMD ["sh", "-c", "npm run lint && npm test && npm run build"]

FROM base AS production
ENV NODE_ENV=production
EXPOSE 4173
CMD ["sh", "-c", "npm run build && npm run preview -- --host 0.0.0.0 --port 4173"]

