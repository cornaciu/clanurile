FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
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

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]