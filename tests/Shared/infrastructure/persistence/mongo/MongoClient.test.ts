import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoClient } from 'mongodb';
import { MongoClientFactory } from '@Shared/infrastructure/persistence/mongo/MongoClient';

// Mock MongoClient
vi.mock('mongodb', () => {
  const mockMongoClient = {
    connect: vi.fn(),
    close: vi.fn(),
  };

  return {
    MongoClient: vi.fn(() => mockMongoClient),
  };
});

describe('MongoClientFactory', () => {
  const mockConfig = { url: 'mongodb://localhost:27017' };
  const mockContextName = 'testContext';

  beforeEach(() => {
    // Clear registered clients before each test
    MongoClientFactory.clients = {};
  });

  it('should create and return a new MongoClient if no client exists for the context', async () => {
    const client = await MongoClientFactory.createClient(mockContextName, mockConfig);

    expect(Object.keys(MongoClientFactory.clients).length).toBe(1);
    expect(client.connect).toHaveBeenCalled();
  });

  it('should return an existing MongoClient if one already exists for the context', async () => {
    const firstClient = await MongoClientFactory.createClient(mockContextName, mockConfig);
    const secondClient = await MongoClientFactory.createClient(mockContextName, mockConfig);

    expect(firstClient).toBe(secondClient);
    expect(Object.keys(MongoClientFactory.clients).length).toBe(1);
  });

  it('should throw an error if connecting to MongoDB fails', async () => {
    MongoClient.mockImplementationOnce(() => {
      return {
        connect: vi.fn().mockRejectedValue(new Error('Connection failed')),
      };
    });

    await expect(MongoClientFactory.createClient(mockContextName, mockConfig)).rejects.toThrow(
      'MongoClientFactory.createAndConnectClient: Error: Connection failed'
    );
  });

  it('should register the created client with the correct context name', async () => {
    const client = await MongoClientFactory.createClient(mockContextName, mockConfig);

    const registeredClients = MongoClientFactory.clients;
    expect(registeredClients[mockContextName]).toBe(client);
  });
});
