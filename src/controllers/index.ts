import { Express } from 'express';

const routes = [
  './status.ts',
  './customers/commands/create.ts',
  './customers/commands/update.ts',
  './customers/commands/delete.ts',
  './customers/commands/addCredit.ts',
  './customers/queries/searchById.ts',
  './customers/queries/searchByCredit.ts',
];

export async function registerRoutes(app: Express) {
  await Promise.all(
    routes.map(async (route: string) => await register(route, app))
  );
}

async function register(routePath: string, app: Express) {
  const fileUrl = new URL(routePath, import.meta.url)
  const route = await import(fileUrl.pathname);
  await route.register(app);
}
