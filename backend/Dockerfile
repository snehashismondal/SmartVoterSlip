FROM node:20-alpine AS base
WORKDIR /app

# Production dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Full install for optional dev
FROM base AS build
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

FROM base AS production
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY database ./database
COPY pdf ./pdf
COPY scripts ./scripts

USER app
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/api/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/index.js"]
