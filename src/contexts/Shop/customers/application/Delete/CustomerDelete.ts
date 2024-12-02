import { TransactionSession } from '@Shared/domain/DBTransaction';
import { Criteria } from '@Shared/domain/Criteria';
import { CustomerRepository } from '../../domain/CustomerRepository';

export class CustomerDelete {
  constructor(private repository: CustomerRepository) { }

  async run(params: { customerId: string }, transactionSession?: TransactionSession): Promise<void> {
    const deleteCriteria = new Criteria({
      filter: { customerId: params.customerId },
      options: { session: transactionSession }
    });
    await this.repository.remove(deleteCriteria);
  }
}
