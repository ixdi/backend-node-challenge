import { test, expect } from "@playwright/test";

test('status', async ({ page }) => {
  const response = await page.request.get(`http://localhost:${process.env.PORT}/status`);
  await expect(response).toBeOK();
});
