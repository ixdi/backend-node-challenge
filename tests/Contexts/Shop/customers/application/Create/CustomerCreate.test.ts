import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerCreate } from '@Shop/customers/application/Create/CustomerCreate';
import { CustomerRepository } from '@Shop/customers/domain/CustomerRepository';
import { Customer } from '@Shop/customers/domain/Customer';
import { Criteria } from '@Shared/domain/Criteria';
import { faker } from '@faker-js/faker';

vi.mock('@Shop/customers/domain/Customer'); // Mock Customer class

describe('CustomerCreate', () => {
  let repositoryMock: CustomerRepository;
  let customerCreate: CustomerCreate;

  beforeEach(() => {
    repositoryMock = {
      save: vi.fn(),
    };
    customerCreate = new CustomerCreate(repositoryMock);
  });

  it('should create and save a customer without a transaction session', async () => {
    const mockCustomer = {
      customerId: { value: faker.string.uuid() },
    };

    Customer.create = vi.fn().mockReturnValue(mockCustomer);
    repositoryMock.save.mockResolvedValue();

    const params = { customerId: mockCustomer.customerId.value, name: faker.internet.username(), credit: faker.number.int({ min: 0, max: 100 }) };

    await customerCreate.run(params);

    expect(Customer.create).toHaveBeenCalledWith(params);
    expect(repositoryMock.save).toHaveBeenCalledWith(
      new Criteria({
        filter: { customerId: params.customerId },
        options: {
          upsert: true,
          session: undefined,
        },
      }),
      mockCustomer
    );
  });
});
