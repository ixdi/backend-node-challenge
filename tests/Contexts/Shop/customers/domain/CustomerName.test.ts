import { describe, it, expect } from 'vitest';
import { CustomerName, CustomerNameEmpty, CustomerNameLengthExceeded } from '@Shop/customers/domain/CustomerName';
import { faker } from '@faker-js/faker';

describe('CustomerName', () => {
  it('should create a CustomerName instance with a valid name', () => {
    const validName = faker.string.alpha({ length: 30 });
    const customerName = new CustomerName(validName);

    expect(customerName.value).toBe(validName);
  });

  it('should throw an error if the name exceeds 50 characters', () => {
    const longName = faker.string.alpha({ length: 51 }); // Generate a name with 51 characters

    expect(() => new CustomerName(longName)).toThrow(CustomerNameLengthExceeded);
    expect(() => new CustomerName(longName)).toThrow(
      `The Customer Name <${longName}> has more than 30 characters`
    );
  });

  it('should allow a name with exactly 50 characters', () => {
    const validMaxName = faker.string.alpha({ length: 50 }); // Generate a name with 50 characters
    const customerName = new CustomerName(validMaxName);

    expect(customerName.value).toBe(validMaxName);
  });

  it('should throw an error for an empty name', () => {
    expect(() => new CustomerName('')).toThrow(CustomerNameEmpty);
  });
});
