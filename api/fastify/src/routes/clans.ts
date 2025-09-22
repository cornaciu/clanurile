import { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma';
import { registerRoute } from '../lib/routesRegistry';

export default async function clansRoutes(fastify: FastifyInstance) {
  const base = '/api/clans';
  registerRoute({ method: 'POST', url: `${base}/create`, summary: 'Create clan', group: 'clans', requiresAuth: true });
  registerRoute({ method: 'GET', url: `${base}/list`, summary: 'List clans', group: 'clans', requiresAuth: false });

  fastify.post(`${base}/create`, async (request, reply) => {
    const userId = (request.headers['x-user-id'] as string) || 'dev-user';
    const body = request.body as any;
    if (!body.name) return reply.status(400).send({ error: 'name required' });

    const clan = await prisma.clan.create({ data: { name: body.name, ownerId: userId, treasury: 0 } });
    // add member
    await prisma.clanMember.create({ data: { clanId: clan.id, userId, role: 'owner' }});
    return { ok: true, clan };
  });

  fastify.get(`${base}/list`, async (request, reply) => {
    const clans = await prisma.clan.findMany({ take: 50 });
    return { clans };
  });
}
