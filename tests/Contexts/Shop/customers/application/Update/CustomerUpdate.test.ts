import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerUpdate } from '@Shop/customers/application/Update/CustomerUpdate';
import { Criteria } from '@Shared/domain/Criteria';
import { Customer } from '@Shop/customers/domain/Customer';
import { CustomerRepository } from '@/contexts/Shop/customers/domain/CustomerRepository';
import { faker } from '@faker-js/faker';

describe('CustomerUpdate', () => {
  let repositoryMock: CustomerRepository;
  let customerUpdate: CustomerUpdate;

  beforeEach(() => {
    // Create a minimal mock for the CustomerRepository
    repositoryMock = {
      search: vi.fn(),
      save: vi.fn(),
    };

    customerUpdate = new CustomerUpdate(repositoryMock);
  });

  it('should update an existing customer and save the changes', async () => {
    const params = { customerId: faker.string.uuid() };
    const data = { name: faker.internet.username() };
    const mockCustomerPrimitives = {
      customerId: params.customerId,
      name: data.name,
      credit: faker.number.int(),
    };

    // Mock repository and Customer.create behavior
    repositoryMock.search.mockResolvedValue([mockCustomerPrimitives]);
    const mockCustomer = {
      customerId: { value: params.customerId },
      name: faker.internet.username(),
      credit: mockCustomerPrimitives.credit,
    };
    Customer.create = vi.fn(() => mockCustomer);

    await customerUpdate.run(params, data);

    expect(repositoryMock.search).toHaveBeenCalledWith(
      new Criteria({ filter: { customerId: params.customerId }, limit: 1 })
    );
    expect(Customer.create).toHaveBeenCalledWith({ ...mockCustomerPrimitives, ...data });
    expect(repositoryMock.save).toHaveBeenCalledWith(
      new Criteria({
        filter: { customerId: params.customerId },
        options: {
          upsert: false,
          session: undefined,
        },
      }),
      mockCustomer
    );
  });

  it('should throw an error if the customer does not exist', async () => {
    const params = { customerId: 'non-existent-customer' };
    const data = { name: faker.internet.username() };

    // Simulate no matching customer
    repositoryMock.search.mockResolvedValue([]);

    await expect(customerUpdate.run(params, data)).rejects.toThrow("Customer doesn't exists");

    expect(repositoryMock.search).toHaveBeenCalledWith(
      new Criteria({ filter: { customerId: params.customerId }, limit: 1 })
    );
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });
});
