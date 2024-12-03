import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoRepository } from '@Shared/infrastructure/persistence/mongo/MongoRepository';
import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';

class TestAggregateRoot {
  toPrimitives() {
    return { id: '1', name: 'Test Name' };
  }
}

class TestMongoRepository extends MongoRepository {
  collectionName() {
    return 'test_collection';
  }
}

const params = {
  id: faker.string.uuid(),
  name: faker.internet.username(),
}

vi.mock('mongodb', () => {
  return {
    MongoClient: vi.fn(() => ({
      db: vi.fn().mockReturnValue({
        collection: vi.fn().mockReturnValue({
          updateOne: vi.fn(),
          find: vi.fn(() => ({
            sort: vi.fn().mockReturnThis(),
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            toArray: vi.fn().mockResolvedValue([
              { _id: params.id, id: params.id, name: params.name },
            ]),
          })),
          deleteOne: vi.fn(),
        }),
      }),
    })),
  };
});

describe('MongoRepository', () => {
  let mongoClientMock;
  let repository;

  beforeEach(() => {
    mongoClientMock = new MongoClient();
    repository = new TestMongoRepository(mongoClientMock);
  });

  it('should persist an aggregate root in the collection', async () => {
    const mockCriteria = {
      getFilters: () => ({ id: params.id }),
      getOptions: () => ({ upsert: true }),
    };
    const aggregateRoot = new TestAggregateRoot();

    const collectionMock = await repository.collection();
    await repository.persist(mockCriteria, aggregateRoot);

    expect(collectionMock.updateOne).toHaveBeenCalledWith(
      mockCriteria.getFilters(),
      { $set: aggregateRoot.toPrimitives() },
      mockCriteria.getOptions()
    );
  });

  it('should find documents based on criteria', async () => {
    const mockCriteria = {
      getFilters: () => ({ name: params.name }),
      getOptions: () => ({}),
      getSort: () => ({ name: 1 }),
      getSkip: () => 0,
      getLimit: () => 10,
    };

    const result = await repository.find(mockCriteria);

    expect(result).toEqual([{ id: params.id, name: params.name }]);
  });

  it('should delete a document based on criteria', async () => {
    const mockCriteria = {
      getFilters: () => ({ id: params.id }),
      getOptions: () => ({}),
    };

    const collectionMock = await repository.collection();
    await repository.delete(mockCriteria);

    expect(collectionMock.deleteOne).toHaveBeenCalledWith(
      mockCriteria.getFilters(),
      mockCriteria.getOptions()
    );
  });
});
