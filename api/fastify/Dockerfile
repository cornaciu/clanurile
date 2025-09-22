# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /work

# în Dockerfile (când build context = api/fastify)
COPY api/fastify/package.json ./api/fastify/
# (opțional) COPY api/fastify/package-lock.json ./api/fastify/  # doar dacă există
WORKDIR /work/api/fastify
RUN npm ci

# copy full repo (so prisma schema is at /work/prisma)
WORKDIR /work
COPY . .

# generate prisma client using schema in repo root
WORKDIR /work/api/fastify
RUN npx prisma generate --schema=/work/prisma/schema.prisma

# build TypeScript
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# copy package manifests and install only production deps
COPY api/fastify/package.json api/fastify/package-lock.json ./
RUN npm ci --production

# copy built app + prisma generated artifacts from builder
COPY --from=builder /work/api/fastify/dist ./dist
COPY --from=builder /work/api/fastify/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /work/api/fastify/node_modules/@prisma ./node_modules/@prisma
# copy any other runtime modules if needed
COPY --from=builder /work/api/fastify/node_modules ./node_modules

EXPOSE 4000
CMD ["node", "dist/index.js"]
