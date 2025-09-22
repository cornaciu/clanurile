import { FastifyInstance } from 'fastify';
import { getRoutes } from '../lib/routesRegistry';

export default async function discoveryRoutes(fastify: FastifyInstance) {
  fastify.get('/api/discovery', async (req, reply) => {
    return { routes: getRoutes() };
  });
}
