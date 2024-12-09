import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

let customerId: string;

test.beforeEach(async ({ page }) => {
  const response = await page.request.post(`http://localhost:${process.env.PORT}/v1/customer/create`, {
    data: {
      name: faker.internet.username(),
    },
  })
  customerId = (await response.json()).customerId;
});

test('GetCustomerSearchByCredit', async ({ page }) => {
  const response = await page.request.get(`http://localhost:${process.env.PORT}/v1/customer/search-by-credit`)
  await expect(response).toBeOK();
  const data = await response.json();
  expect(data.customers.length).toBe(1);
});

test.afterEach(async ({ page }) => {
  const response = await page.request.post(`http://localhost:${process.env.PORT}/v1/customer/delete`, {
    data: {
      customerId: customerId,
    },
  })
  await expect(response).toBeOK();
});
