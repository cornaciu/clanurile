import Fastify from 'fastify';
import cors from '@fastify/cors';
import healthRoutes from './routes/health';
import actionsRoutes from './routes/actions';
import clansRoutes from './routes/clans';
import discoveryRoutes from './routes/discovery';
import prisma from './lib/prisma';

const isDev = process.env.NODE_ENV !== 'production';

// Construim opțiunile logger într-un mod compatibil cu TS.
// Observație: pino-pretty folosește transport în versiunile noi.
const loggerOptions: any = {
  level: process.env.LOG_LEVEL || 'info',
};

if (isDev) {
  // în development folosim pino-pretty prin transport
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  };
}

const fastify = Fastify({
  logger: loggerOptions
});

async function main() {
  await fastify.register(cors, { origin: true });

  // inregistram rutele
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

// shutdown cleanup
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

main();
