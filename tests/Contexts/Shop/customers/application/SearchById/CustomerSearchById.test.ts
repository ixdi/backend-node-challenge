import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerSearchById } from '@Shop/customers/application/SearchById/CustomerSearchById';
import { Criteria } from '@Shared/domain/Criteria';
import { faker } from '@faker-js/faker';

describe('CustomerSearchById', () => {
  let repositoryMock;
  let customerSearchById;

  beforeEach(() => {
    // Create a mock for CustomerRepository
    repositoryMock = {
      search: vi.fn(),
    };

    customerSearchById = new CustomerSearchById(repositoryMock);
  });

  it('should return a customer when the ID exists', async () => {
    const params = { customerId: 'customer-id-1' };
    const mockCustomerPrimitives = [
      {
        customerId: faker.string.uuid(),
        name: faker.internet.username(),
        credit: faker.number.int(),
      },
    ];

    // Mock repository search method
    repositoryMock.search.mockResolvedValue(mockCustomerPrimitives);

    const result = await customerSearchById.run(params);

    expect(repositoryMock.search).toHaveBeenCalledWith(
      new Criteria({
        filter: { customerId: params.customerId },
        limit: 1,
      })
    );
    expect(result).toEqual(mockCustomerPrimitives);
  });

  it('should return an empty array when the ID does not exist', async () => {
    const params = { customerId: 'non-existent-customer' };

    // Mock repository search method to return an empty array
    repositoryMock.search.mockResolvedValue([]);

    const result = await customerSearchById.run(params);

    expect(repositoryMock.search).toHaveBeenCalledWith(
      new Criteria({
        filter: { customerId: params.customerId },
        limit: 1,
      })
    );
    expect(result).toEqual([]);
  });

  it('should throw an error if repository.search fails', async () => {
    const params = { customerId: faker.string.uuid() };

    // Simulate an error in the repository
    repositoryMock.search.mockRejectedValue(new Error('Database error'));

    await expect(customerSearchById.run(params)).rejects.toThrow('Database error');

    expect(repositoryMock.search).toHaveBeenCalledWith(
      new Criteria({
        filter: { customerId: params.customerId },
        limit: 1,
      })
    );
  });
});
