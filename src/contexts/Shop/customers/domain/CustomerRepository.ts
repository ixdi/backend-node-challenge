import { Customer } from './Customer';
import { Criteria } from '@Shared/domain/Criteria';
import { Primitives } from '@Shared/domain/Primitives';

export interface CustomerRepository {
  save(criteria: Criteria, customer: Customer): Promise<void>;
  search(criteria: Criteria): Promise<Primitives<Customer>[]>;
  remove(criteria: Criteria): Promise<void>;
}
