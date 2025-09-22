"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = actionsRoutes;
const prisma_1 = __importDefault(require("../lib/prisma"));
const routesRegistry_1 = require("../lib/routesRegistry");
async function actionsRoutes(fastify) {
    const base = '/api/actions';
    (0, routesRegistry_1.registerRoute)({ method: 'POST', url: `${base}/start`, summary: 'Start action', group: 'actions', requiresAuth: true });
    (0, routesRegistry_1.registerRoute)({ method: 'GET', url: `${base}/:id/status`, summary: 'Action status', group: 'actions', requiresAuth: true });
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
        const userId = request.headers['x-user-id'] || 'dev-user';
        const body = request.body;
        // simplu: scrie in action_queue (table)
        const action = await prisma_1.default.actionQueue.create({
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
        const { id } = request.params;
        const action = await prisma_1.default.actionQueue.findUnique({ where: { id } });
        if (!action)
            return reply.status(404).send({ error: 'not found' });
        return { id: action.id, status: action.status, result: action.result };
    });
}
//# sourceMappingURL=actions.js.map