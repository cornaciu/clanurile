"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = healthRoutes;
const routesRegistry_1 = require("../lib/routesRegistry");
async function healthRoutes(fastify) {
    const url = '/api/health';
    (0, routesRegistry_1.registerRoute)({ method: 'GET', url, summary: 'Health check', group: 'system', requiresAuth: false });
    fastify.get(url, async (request, reply) => {
        return { status: 'ok', time: new Date().toISOString() };
    });
}
//# sourceMappingURL=health.js.map