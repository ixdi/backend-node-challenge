import { Customer } from '../../domain/Customer';
import { CustomerRepository } from '../../domain/CustomerRepository';
import { Criteria } from '@Shared/domain/Criteria';
import { TransactionSession } from '@Shared/domain/DBTransaction';

export class CustomerCreate {
  constructor(private repository: CustomerRepository) { }

  async run(params: { customerId: string, name: string, credit: number }, transactionSession?: TransactionSession): Promise<void> {
    const customer = Customer.create(params);
    const saveCriteria = new Criteria({
      filter: { customerId: customer.customerId.value },
      options: {
        upsert: true,
        session: transactionSession
      }
    });
    await this.repository.save(saveCriteria, customer);
  }
}
