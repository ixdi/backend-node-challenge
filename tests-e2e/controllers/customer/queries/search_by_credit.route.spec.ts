import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

let customerId: string;

test.beforeEach(async ({ page }) => {
  const response = await page.request.post('http://localhost:5000/v1/customer/create', {
    data: {
      name: faker.internet.username(),
      email: faker.internet.email(),
    },
  })
  customerId = (await response.json()).customerId;
});

test('GetCustomerSearchByCredit', async ({ page }) => {
  const response = await page.request.get('http://localhost:5000/v1/customer/search-by-credit', {
    data: {
    },
  })
  const data = await response.json();
  await expect(response).toBeOK();
  expect(data.customers.length).toBe(1);
});

test.afterEach(async ({ page }) => {
  const response = await page.request.post('http://localhost:5000/v1/customer/delete', {
    data: {
      customerId: customerId,
    },
  })
  await expect(response).toBeOK();
});
