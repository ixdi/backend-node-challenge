interface MongoConfig {
  url: string;
}

export default MongoConfig;

export class MongoConfigFactory {
  static createConfig(): MongoConfig {
    return {
      url: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    };
  }
}
