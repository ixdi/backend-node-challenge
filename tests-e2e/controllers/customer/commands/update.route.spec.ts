import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

let customerId: string;

test.beforeEach(async ({ page }) => {
  const response = await page.request.post('http://localhost:5000/v1/customer/create', {
    data: {
      name: faker.internet.username(),
    },
  })
  customerId = (await response.json()).customerId;
});

test('PostCustomerUpdate', async ({ page }) => {
  const response = await page.request.post('http://localhost:5000/v1/customer/update', {
    data: {
      customerId: customerId,
      name: faker.internet.username(),
    },
  })
  await expect(response).toBeOK();
});

test.afterEach(async ({ page }) => {
  const response = await page.request.post('http://localhost:5000/v1/customer/delete', {
    data: {
      customerId: customerId,
    },
  })
  await expect(response).toBeOK();
});

