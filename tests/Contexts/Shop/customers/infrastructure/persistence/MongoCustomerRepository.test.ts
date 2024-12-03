import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoCustomerRepository } from '@Shop/customers/infrastructure/persistence/MongoCustomerRepository';
import { Criteria } from '@Shared/domain/Criteria';
import { MongoClient } from 'mongodb';
import { Customer } from '@Shop/customers/domain/Customer';
import { faker } from '@faker-js/faker';

vi.mock('mongodb', () => {
  return {
    MongoClient: vi.fn(() => ({
      db: vi.fn().mockReturnValue({
        collection: vi.fn().mockReturnValue({
          insertOne: vi.fn(),
          find: vi.fn(),
          deleteMany: vi.fn(),
          updateOne: vi.fn(),
        }),
      }),
    })),
  };
});

describe('MongoCustomerRepository', () => {
  let mongoClientMock;
  let repository;

  beforeEach(() => {
    mongoClientMock = new MongoClient();
    repository = new MongoCustomerRepository(mongoClientMock);
  });

  it('should save a customer using the persist method', async () => {
    const criteria = new Criteria({ filter: { customerId: 'customer-id-1' } });
    const mockCustomer = new Customer({
      id: faker.string.uuid(),
      customerId: faker.string.uuid(),
      name: faker.internet.username(),
      credit: faker.number.int({ min: 0, max: 100 }),
    });

    const persistSpy = vi.spyOn(repository, 'persist').mockResolvedValue();

    await repository.save(criteria, mockCustomer);

    expect(persistSpy).toHaveBeenCalledWith(criteria, mockCustomer);
  });

  it('should search customers using the find method', async () => {
    const criteria = new Criteria({ filter: { name: 'John Doe' } });
    const mockResults = [
      {
        id: faker.string.uuid(),
        customerId: faker.string.uuid(),
        name: faker.internet.username(),
        credit: faker.number.int({ min: 0, max: 100 }),
      },
    ];

    const findSpy = vi.spyOn(repository, 'find').mockResolvedValue(mockResults);

    const results = await repository.search(criteria);

    expect(findSpy).toHaveBeenCalledWith(criteria);
    expect(results).toEqual(mockResults);
  });

  it('should remove customers using the delete method', async () => {
    const criteria = new Criteria({ filter: { customerId: 'customer-id-1' } });

    const deleteSpy = vi.spyOn(repository, 'delete').mockResolvedValue();

    await repository.remove(criteria);

    expect(deleteSpy).toHaveBeenCalledWith(criteria);
  });
});
