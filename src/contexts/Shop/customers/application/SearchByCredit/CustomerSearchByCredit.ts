import { Primitives } from '@Shared/domain/Primitives';
import { Customer } from '../../domain/Customer';
import { CustomerRepository } from '../../domain/CustomerRepository';
import { Criteria } from '@Shared/domain/Criteria';

export class CustomerSearchByCredit {
  constructor(private repository: CustomerRepository) { }

  async run(): Promise<Primitives<Customer>[]> {
    const findCriteriaByCredit = new Criteria({
      filter: {},
      sort: { credit: 'desc' },
      limit: 100,
    });
    return await this.repository.search(findCriteriaByCredit);
  }
}
