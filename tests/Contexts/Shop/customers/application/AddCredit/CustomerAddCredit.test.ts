import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerAddCredit } from '@Shop/customers/application/AddCredit/CustomerAddCredit';
import { CustomerRepository } from '@Shop/customers/domain/CustomerRepository';
import { Customer } from '@Shop/customers/domain/Customer';
import { Criteria } from '@Shared/domain/Criteria';

vi.mock('@Shared/customers/domain/Customer');
vi.mock('@Shared/domain/Criteria');

describe('CustomerAddCredit', () => {
  let repositoryMock: CustomerRepository;
  let customerAddCredit: CustomerAddCredit;

  beforeEach(() => {
    repositoryMock = {
      search: vi.fn(),
      save: vi.fn(),
      remove: vi.fn(),
    };
    customerAddCredit = new CustomerAddCredit(repositoryMock);
  });

  it('should add credit to an existing customer', async () => {
    const mockCustomerPrimitives = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      customerId: 'customer-id-1',
      name: 'Maria',
      credit: 100,
    };

    const mockCustomer = {
      ...mockCustomerPrimitives,
      addCredit: vi.fn(),
      customerId: { value: mockCustomerPrimitives.customerId },
    };

    Customer.create = vi.fn().mockReturnValue(mockCustomer);
    repositoryMock.search.mockResolvedValue([mockCustomerPrimitives]);
    repositoryMock.save.mockResolvedValue();

    await customerAddCredit.run({ customerId: 'customer-id-1', creditToAdd: 50 });

    expect(repositoryMock.search).toHaveBeenCalledWith(
      expect.any(Criteria) // Assert the search criteria
    );
    expect(mockCustomer.addCredit).toHaveBeenCalledWith(50);
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.any(Criteria), // Assert the update criteria
      mockCustomer
    );
  });

  it('should throw an error if the customer does not exist', async () => {
    repositoryMock.search.mockResolvedValue([]);

    await expect(
      customerAddCredit.run({ customerId: 'non-existent-customer', creditToAdd: 50 })
    ).rejects.toThrow("Customer doesn't exists");

    expect(repositoryMock.search).toHaveBeenCalledWith(
      expect.any(Criteria) // Assert the search criteria
    );
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });
});
