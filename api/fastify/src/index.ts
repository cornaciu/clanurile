import Fastify from 'fastify';
import cors from '@fastify/cors';
import healthRoutes from './routes/health';
import actionsRoutes from './routes/actions';
import clansRoutes from './routes/clans';
import discoveryRoutes from './routes/discovery';
import prisma from './lib/prisma';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: true
  }
});

async function main() {
  await fastify.register(cors, { origin: true });
  // register routes
  await fastify.register(healthRoutes);
  await fastify.register(actionsRoutes);
  await fastify.register(clansRoutes);
  await fastify.register(discoveryRoutes);

  const port = Number(process.env.PORT || 4000);
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Fastify listening on ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();

// shutdown cleanup
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
