import { Customer } from '../../domain/Customer';
import { CustomerRepository } from '../../domain/CustomerRepository';
import { Criteria } from '@Shared/domain/Criteria';
import { TransactionSession } from '@Shared/domain/DBTransaction';
import { Primitives } from '@Shared/domain/Primitives';

export class CustomerUpdate {
  constructor(private repository: CustomerRepository) { }

  async run(params: { customerId: string }, data: Partial<Primitives<Customer>>, transactionSession?: TransactionSession): Promise<void> {
    const searchCriteria = new Criteria({ filter: { customerId: params.customerId } });
    const customerPrimitives: Primitives<Customer>[] = await this.repository.search(searchCriteria);
    if (customerPrimitives.length > 0) {
      const customer = Customer.create({ ...customerPrimitives[0], ...data });
      const updateCriteria = new Criteria({
        filter: { customerId: customer.customerId.value },
        options: {
          upsert: false,
          session: transactionSession
        }
      });
      await this.repository.save(updateCriteria, customer);
    } else {
      throw new Error("Customer doesn't exists");
    }
  }
}
