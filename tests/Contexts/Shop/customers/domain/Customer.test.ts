import { describe, it, expect } from 'vitest';
import { Customer } from '@/contexts/Shop/customers/domain/Customer';
import { faker } from '@faker-js/faker';

describe('Customer', () => {
  const mockId = faker.string.uuid();
  const mockCustomerId = faker.string.uuid();
  const mockName = faker.internet.username();
  const mockCredit = faker.number.int({ min: 0, max: 10000 })

  it('should create a Customer instance using create()', () => {
    const customer = Customer.create({
      customerId: mockCustomerId,
      name: mockName,
      credit: mockCredit,
    });

    expect(customer.customerId.value).toBe(mockCustomerId);
    expect(customer.name.value).toBe(mockName);
    expect(customer.credit.value).toBe(mockCredit);
  });

  it('should convert a Customer instance to primitives using toPrimitives()', () => {
    const customer = new Customer({
      id: mockId,
      customerId: mockCustomerId,
      name: mockName,
      credit: mockCredit,
    });

    const primitives = customer.toPrimitives();
    expect(primitives).toEqual({
      customerId: mockCustomerId,
      name: mockName,
      credit: mockCredit,
    });
  });

  it('should correctly add credit using addCredit()', () => {
    const customer = new Customer({
      id: mockId,
      customerId: mockCustomerId,
      name: mockName,
      credit: mockCredit,
    });

    const additionalCredit = 50;
    customer.addCredit(additionalCredit);

    expect(customer.credit.value).toBe(mockCredit + 50); // Initial + 50 added
  });
});
