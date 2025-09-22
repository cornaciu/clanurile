"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoute = registerRoute;
exports.getRoutes = getRoutes;
const routes = [];
function registerRoute(meta) {
    routes.push(meta);
}
function getRoutes() {
    return routes;
}
//# sourceMappingURL=routesRegistry.js.map