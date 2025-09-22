"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = webhooks;
const bullmq_1 = require("bullmq");
async function webhooks(fastify) {
    // Redis connection via REDIS_URL (ex: redis://redis:6379)
    const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
    const queue = new bullmq_1.Queue('action-queue', { connection: { url: redisUrl } });
    // simple secret check for authenticity (set NOCODB_WEBHOOK_SECRET)
    const SECRET = process.env.NOCODB_WEBHOOK_SECRET || '';
    fastify.post('/api/webhook/nocodb/:table', async (req, reply) => {
        const { table } = req.params;
        const headers = req.headers;
        if (SECRET) {
            const sig = headers['x-nocodb-hook-secret'] || headers['x-hook-secret'] || '';
            if (!sig || sig !== SECRET) {
                return reply.status(401).send({ error: 'invalid webhook secret' });
            }
        }
        // NocoDB sends payload with row, event, etc.
        const payload = req.body;
        // only handle inserts into action_queue
        if (table === 'action_queue' && payload?.event === 'insert') {
            const row = payload.row;
            // enqueue job with the action id
            await queue.add('process-action', { actionId: row.id }, { attempts: 3 });
        }
        return reply.send({ ok: true });
    });
}
//# sourceMappingURL=webhooks.js.map