import { FastifyInstance } from 'fastify';

export default async function nocodbProxy(fastify: FastifyInstance) {
  const BASE = process.env.NOCODB_BASE || 'http://nocodb:8080';
  const API_KEY = process.env.NOCODB_API_KEY || '';
  const PROJECT = process.env.NOCODB_PROJECT || 'default';

  fastify.get('/api/admin/:table', async (req, reply) => {
    const { table } = req.params as any;
    const url = `${BASE}/api/v1/db/data/${PROJECT}/${table}`;
    const res = await fetch(url, { headers: { 'xc-auth': API_KEY } });
    const json = await res.json();
    return reply.send(json);
  });
}
