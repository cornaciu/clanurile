import { FastifyInstance } from 'fastify';
import { registerRoute } from '../lib/routesRegistry';

export default async function healthRoutes(fastify: FastifyInstance) {
  const url = '/api/health';
  registerRoute({ method: 'GET', url, summary: 'Health check', group: 'system', requiresAuth: false });

  fastify.get(url, async (request, reply) => {
    return { status: 'ok', time: new Date().toISOString() };
  });
}
