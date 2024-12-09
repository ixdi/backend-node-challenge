import { Router } from 'express';

const routes = [
  './status.ts',
  './customers/commands/create.ts',
  './customers/commands/update.ts',
  './customers/commands/delete.ts',
  './customers/commands/addCredit.ts',
  './customers/queries/searchById.ts',
  './customers/queries/searchByCredit.ts',
];

export function registerRoutes(router: Router) {
  routes.map((route: string) => register(route, router));
}

async function register(routePath: string, router: Router) {
  const fileUrl = new URL(routePath, import.meta.url)
  const route = await import(fileUrl.pathname);
  route.register(router);
}
