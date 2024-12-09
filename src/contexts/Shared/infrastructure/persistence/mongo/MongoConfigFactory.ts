export interface MongoConfig {
  url: string;
}

export class MongoConfigFactory {
  static createConfig(): MongoConfig {
    return {
      url: process.env.MONGODB_URI || 'mongodb://localhost:27017/motorbikesshop',
    };
  }
}
