import { test, expect } from "@playwright/test";

test('status', async ({ page }) => {
  const response = await page.request.get('http://localhost:5000/status');
  await expect(response).toBeOK();
});
