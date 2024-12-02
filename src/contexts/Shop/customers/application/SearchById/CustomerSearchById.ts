import { Primitives } from '@Shared/domain/Primitives';

import { Customer } from '../../domain/Customer';
import { CustomerRepository } from '../../domain/CustomerRepository';
import { Criteria } from '@Shared/domain/Criteria';

export class CustomerSearchById {
  constructor(private repository: CustomerRepository) { }

  async run(params: { customerId: string }): Promise<Primitives<Customer[]>> {
    const findCriteriaById = new Criteria({
      filter: { customerId: params.customerId, },
      limit: 1,
    });
    return await this.repository.search(findCriteriaById);
  }
}
