import { Express } from 'express';

const routes = [
  './status.route.ts',
  './customers/commands/create.route.ts',
  './customers/commands/update.route.ts',
  './customers/commands/delete.route.ts',
  './customers/commands/addCredit.route.ts',
  './customers/queries/searchById.route.ts',
  './customers/queries/searchByCredit.route.ts',
];

export function registerRoutes(router: Router) {
  routes.map((route: string) => register(route, router));
}

async function register(routePath: string, router: Router) {
  const fileUrl = new URL(routePath, import.meta.url)
  const route = await import(fileUrl.pathname);
  route.register(router);
}
