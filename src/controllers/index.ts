import { Router } from 'express';

const routes = [
  './status.route.ts',
  './customer/commands/create.route.ts',
  './customer/commands/update.route.ts',
  './customer/commands/delete.route.ts',
  './customer/commands/addCredit.route.ts',
  './customer/queries/searchById.route.ts',
  './customer/queries/searchByCredit.route.ts',
];

export function registerRoutes(router: Router) {
  routes.map((route: string) => register(route, router));
}

async function register(routePath: string, router: Router) {
  const fileUrl = new URL(routePath, import.meta.url)
  const route = await import(fileUrl.pathname);
  route.register(router);
}
