"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clansRoutes;
const prisma_1 = __importDefault(require("../lib/prisma"));
const routesRegistry_1 = require("../lib/routesRegistry");
async function clansRoutes(fastify) {
    const base = '/api/clans';
    (0, routesRegistry_1.registerRoute)({ method: 'POST', url: `${base}/create`, summary: 'Create clan', group: 'clans', requiresAuth: true });
    (0, routesRegistry_1.registerRoute)({ method: 'GET', url: `${base}/list`, summary: 'List clans', group: 'clans', requiresAuth: false });
    fastify.post(`${base}/create`, async (request, reply) => {
        const userId = request.headers['x-user-id'] || 'dev-user';
        const body = request.body;
        if (!body.name)
            return reply.status(400).send({ error: 'name required' });
        const clan = await prisma_1.default.clan.create({ data: { name: body.name, ownerId: userId, treasury: 0 } });
        // add member
        await prisma_1.default.clanMember.create({ data: { clanId: clan.id, userId, role: 'owner' } });
        return { ok: true, clan };
    });
    fastify.get(`${base}/list`, async (request, reply) => {
        const clans = await prisma_1.default.clan.findMany({ take: 50 });
        return { clans };
    });
}
//# sourceMappingURL=clans.js.map