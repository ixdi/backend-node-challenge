import { MongoRepository } from '@Shared/infrastructure/persistence/mongo/MongoRepository';
import { Customer } from '../../domain/Customer';
import { CustomerRepository } from '../../domain/CustomerRepository';
import { Criteria } from '@Shared/domain/Criteria';
import { MongoClient } from 'mongodb';
import { Primitives } from '@Shared/domain/Primitives';

export class MongoCustomerRepository extends MongoRepository<Customer> implements CustomerRepository {
  constructor(client: MongoClient) {
    super(client);
  }

  collectionName(): string {
    return 'customers';
  }

  public async save(criteria: Criteria, customer: Customer): Promise<void> {
    return await this.persist(criteria, customer);
  }

  public async search(criteria: Criteria): Promise<Primitives<Customer>[]> {
    return await this.find(criteria);
  }

  public async remove(criteria: Criteria): Promise<void> {
    return await this.delete(criteria);
  }
}
