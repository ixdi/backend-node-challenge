import { MongoClient } from 'mongodb';
import MongoConfig from './MongoConfig';

export class MongoClientFactory {
  private static clients: { [key: string]: MongoClient } = {};

  static async createClient(contextName: string, config: MongoConfig): Promise<MongoClient> {
    let client = MongoClientFactory.getClient(contextName);

    if (!client) {
      client = await MongoClientFactory.createAndConnectClient(config);

      MongoClientFactory.registerClient(client, contextName);
    }

    return client;
  }

  private static getClient(contextName: string): MongoClient | null {
    return MongoClientFactory.clients[contextName];
  }

  private static async createAndConnectClient(config: MongoConfig): Promise<MongoClient> {
    try {
      const client = new MongoClient(config.url, {
        ignoreUndefined: true,
        compressors: 'zstd',
        heartbeatFrequencyMS: 10000,
        maxIdleTimeMS: 30000,
        minPoolSize: 1,
        maxPoolSize: 40,
        maxConnecting: 5,
        tls: process.env.NODE_ENV === 'production',
      });

      await client.connect();

      return client;
    } catch (error) {
      throw new Error('MongoClientFactory.createAndConnectClient: ' + error);
    }
  }

  private static registerClient(client: MongoClient, contextName: string): void {
    MongoClientFactory.clients[contextName] = client;
  }
}
