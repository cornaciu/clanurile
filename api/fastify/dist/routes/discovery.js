"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = discoveryRoutes;
const routesRegistry_1 = require("../lib/routesRegistry");
async function discoveryRoutes(fastify) {
    fastify.get('/api/discovery', async (req, reply) => {
        return { routes: (0, routesRegistry_1.getRoutes)() };
    });
}
//# sourceMappingURL=discovery.js.map