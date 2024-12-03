import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

test('PostCustomerCreate', async ({ page }) => {
  const response = await page.request.post('http://localhost:5000/v1/customer/create', {
    data: {
      name: faker.internet.username(),
      email: faker.internet.email(),
    },
  })
  await expect(response).toBeOK();
});
