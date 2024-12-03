import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerDelete } from '@Shop/customers/application/Delete/CustomerDelete';
import { CustomerRepository } from '@/contexts/Shop/customers/domain/CustomerRepository';
import { Criteria } from '@Shared/domain/Criteria';
import { faker } from '@faker-js/faker';

vi.mock('@Shared/domain/Criteria', () => {
  return {
    Criteria: vi.fn(),
  };
});

describe('CustomerDelete', () => {
  let repositoryMock: CustomerRepository;
  let customerDelete: CustomerDelete;

  beforeEach(() => {
    repositoryMock = {
      remove: vi.fn(),
    };

    customerDelete = new CustomerDelete(repositoryMock);
  });

  it('should create Criteria with correct parameters and call repository.remove without transaction session', async () => {
    const params = { customerId: faker.string.uuid() };

    const mockCriteriaInstance = {};
    Criteria.mockImplementation(() => mockCriteriaInstance);

    await customerDelete.run(params);

    expect(Criteria).toHaveBeenCalledWith({
      filter: { customerId: params.customerId },
      options: { session: undefined },
    });
    expect(repositoryMock.remove).toHaveBeenCalledWith(mockCriteriaInstance);
  });

  it('should call repository.remove exactly once', async () => {
    const params = { customerId: faker.string.uuid() };

    const mockCriteriaInstance = {};
    Criteria.mockImplementation(() => mockCriteriaInstance); // Mock Criteria constructor

    await customerDelete.run(params);

    expect(repositoryMock.remove).toHaveBeenCalledTimes(1);
  });
});
