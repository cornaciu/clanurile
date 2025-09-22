export type RouteMeta = {
  method: string;
  url: string;
  summary?: string;
  group?: string;
  requiresAuth?: boolean;
};

const routes: RouteMeta[] = [];

export function registerRoute(meta: RouteMeta) {
  routes.push(meta);
}

export function getRoutes() {
  return routes;
}
