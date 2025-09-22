"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const health_1 = __importDefault(require("./routes/health"));
const actions_1 = __importDefault(require("./routes/actions"));
const clans_1 = __importDefault(require("./routes/clans"));
const discovery_1 = __importDefault(require("./routes/discovery"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const isDev = process.env.NODE_ENV !== 'production';
// Construim opțiunile logger într-un mod compatibil cu TS.
// Observație: pino-pretty folosește transport în versiunile noi.
const loggerOptions = {
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
const fastify = (0, fastify_1.default)({
    logger: loggerOptions
});
async function main() {
    await fastify.register(cors_1.default, { origin: true });
    // inregistram rutele
    await fastify.register(health_1.default);
    await fastify.register(actions_1.default);
    await fastify.register(clans_1.default);
    await fastify.register(discovery_1.default);
    const port = Number(process.env.PORT || 4000);
    try {
        await fastify.listen({ port, host: '0.0.0.0' });
        fastify.log.info(`Fastify listening on ${port}`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
// shutdown cleanup
process.on('SIGINT', async () => {
    await prisma_1.default.$disconnect();
    process.exit(0);
});
main();
//# sourceMappingURL=index.js.map