import { Collection, MongoClient, Sort, WithId } from 'mongodb';
import { AggregateRoot } from '@Shared/domain/AggregateRoot';
import { Criteria } from '@Shared/domain/Criteria';
import { Primitives } from '@Shared/domain/Primitives';

export abstract class MongoRepository<T extends AggregateRoot> {
  constructor(private _client: MongoClient) { }

  protected abstract collectionName(): string;

  protected client(): MongoClient {
    return this._client;
  }

  protected async collection(): Promise<Collection> {
    return this._client.db().collection(this.collectionName());
  }

  protected async persist(criteria: Criteria, aggregateRoot: T): Promise<void> {
    const collection = await this.collection();
    const document = aggregateRoot.toPrimitives();
    await collection.updateOne(criteria.getFilters(), { $set: document }, criteria.getOptions());
  }

  protected async find(criteria: Criteria): Promise<Primitives<T>[]> {
    const collection = await this.collection();
    const dbData = collection.find<WithId<Primitives<T>[]>>(criteria.getFilters(), criteria.getOptions())
      .sort(criteria.getSort() as Sort)
      .skip(criteria.getSkip())
      .limit(criteria.getLimit());
    const collectionPrimitives = await dbData.toArray();
    return collectionPrimitives.map((primitives) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id: _, ...restPrimitives } = primitives;
      return restPrimitives as Primitives<T>;
    });
  }

  protected async delete(criteria: Criteria): Promise<void> {
    const collection = await this.collection();
    await collection.deleteOne(criteria.getFilters(), criteria.getOptions());
  }
}
