import { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { registerRoute } from '../lib/routesRegistry';

export default async function actionsRoutes(fastify: FastifyInstance) {
  const base = '/api/actions';
  registerRoute({ method: 'POST', url: `${base}/start`, summary: 'Start action', group: 'actions', requiresAuth: true });
  registerRoute({ method: 'GET', url: `${base}/:id/status`, summary: 'Action status', group: 'actions', requiresAuth: true });

  // start an action (simplified)
  fastify.post(`${base}/start`, {
    schema: {
      body: {
        type: 'object',
        required: ['actionType'],
        properties: { actionType: { type: 'string' }, params: { type: 'object' } }
      }
    }
  }, async (request, reply) => {
    // in prod: verifica JWT si user id
    const userId = (request.headers['x-user-id'] as string) || 'dev-user';

    const body = request.body as any;
    // simplu: scrie in action_queue (table)
    const action = await prisma.actionQueue.create({
      data: {
        userId,
        actionType: body.actionType,
        params: JSON.stringify(body.params || {}),
        status: 'queued',
        startedAt: new Date()
      }
    });

    // in background worker se va procesa
    return { ok: true, actionId: action.id };
  });

  fastify.get(`${base}/:id/status`, async (request, reply) => {
    const { id } = request.params as any;
    const action = await prisma.actionQueue.findUnique({ where: { id } });
    if (!action) return reply.status(404).send({ error: 'not found' });
    return { id: action.id, status: action.status, result: action.result };
  });
}
