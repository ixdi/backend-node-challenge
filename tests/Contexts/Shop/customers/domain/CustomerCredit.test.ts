import { describe, it, expect } from 'vitest';
import { CustomerCredit, CustomerCreditIsInvalid } from '@Shop/customers/domain/CustomerCredit';
import { faker } from '@faker-js/faker';

describe('CustomerCredit', () => {
  it('should create a CustomerCredit instance with default value 0', () => {
    const credit = new CustomerCredit();
    expect(credit.value).toBe(0);
  });

  it('should create a CustomerCredit instance with a valid positive value', () => {
    const validValue = faker.number.int({ min: 1, max: 10000 });
    const credit = new CustomerCredit(validValue);
    expect(credit.value).toBe(validValue);
  });

  it('should throw an error if the value is negative', () => {
    const negativeValue = -1;

    expect(() => new CustomerCredit(negativeValue)).toThrow(CustomerCreditIsInvalid);
    expect(() => new CustomerCredit(negativeValue)).toThrow(
      `The Customer Credit <${negativeValue}> is less than 0`
    );
  });

  it('should allow a value of 0 without throwing an error', () => {
    const credit = new CustomerCredit(0);
    expect(credit.value).toBe(0);
  });
});
