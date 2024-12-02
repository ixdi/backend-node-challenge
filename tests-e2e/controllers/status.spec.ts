import { BackendApp } from "@/server/BackendApp";
import { test, expect } from "@playwright/test";

let server: BackendApp;

test.beforeAll(async () => {
  server = new BackendApp();
  server.start();
});

test.afterAll(async () => {
  if (server) {
    await server.stop();
  }
});

test('status', async ({ page }) => {
  const response = await page.request.get('http://localhost:5000/status');
  await expect(response).toBeOK();
});
