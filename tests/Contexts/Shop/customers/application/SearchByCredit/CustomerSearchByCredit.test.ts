import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerSearchByCredit } from '@Shop/customers/application/SearchByCredit/CustomerSearchByCredit';
import { Criteria } from '@Shared/domain/Criteria';
import { faker } from '@faker-js/faker';

describe('CustomerSearchByCredit', () => {
  let repositoryMock;
  let customerSearchByCredit;

  beforeEach(() => {
    // Create a mock for CustomerRepository
    repositoryMock = {
      search: vi.fn(),
    };

    customerSearchByCredit = new CustomerSearchByCredit(repositoryMock);
  });

  it('should return customers sorted by credit in descending order', async () => {
    const mockCustomerPrimitives = [
      { customerId: faker.string.uuid(), name: faker.internet.username(), credit: faker.number.int() },
      { customerId: faker.string.uuid(), name: faker.internet.username(), credit: faker.number.int() },
    ];

    // Mock repository search method
    repositoryMock.search.mockResolvedValue(mockCustomerPrimitives);

    const result = await customerSearchByCredit.run();

    expect(repositoryMock.search).toHaveBeenCalledWith(
      new Criteria({
        filter: {},
        sort: { credit: 'desc' },
      })
    );
    expect(result).toEqual(mockCustomerPrimitives);
  });

  it('should return an empty array if no customers are found', async () => {
    // Mock repository search method to return an empty array
    repositoryMock.search.mockResolvedValue([]);

    const result = await customerSearchByCredit.run();

    expect(repositoryMock.search).toHaveBeenCalledWith(
      new Criteria({
        filter: {},
        sort: { credit: 'desc' },
      })
    );
    expect(result).toEqual([]);
  });

  it('should throw an error if repository.search fails', async () => {
    // Simulate an error in the repository
    repositoryMock.search.mockRejectedValue(new Error('Database error'));

    await expect(customerSearchByCredit.run()).rejects.toThrow('Database error');

    expect(repositoryMock.search).toHaveBeenCalledWith(
      new Criteria({
        filter: {},
        sort: { credit: 'desc' },
      })
    );
  });
});
