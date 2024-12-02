import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerCreate } from '@Shop/customers/application/Create/CustomerCreate';
import { CustomerRepository } from '@Shop/customers/domain/CustomerRepository';
import { Customer } from '@Shop/customers/domain/Customer';
import { Criteria } from '@Shared/domain/Criteria';

vi.mock('../src/domain/Customer'); // Mock Customer class

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
      customerId: { value: 'customer-id-1' },
    };

    Customer.create = vi.fn().mockReturnValue(mockCustomer);
    repositoryMock.save.mockResolvedValue();

    const params = { customerId: 'customer-id-1', name: 'Maria', credit: 100 };

    await customerCreate.run(params);

    expect(Customer.create).toHaveBeenCalledWith(params);
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.any(Criteria), // Check Criteria passed to save
      mockCustomer
    );
  });
});
