import { Customer } from '../../domain/Customer';
import { CustomerRepository } from '../../domain/CustomerRepository';
import { Criteria } from '@Shared/domain/Criteria';
import { Primitives } from '@Shared/domain/Primitives';

export class CustomerAddCredit {
  constructor(private repository: CustomerRepository) { }

  async run(params: { customerId: string, creditToAdd: number }): Promise<void> {
    const searchCriteria = new Criteria({ filter: { customerId: params.customerId } });
    const customerPrimitives: Primitives<Customer>[] = await this.repository.search(searchCriteria);
    if (customerPrimitives.length === 1) {
      const customer = Customer.create(customerPrimitives[0]);
      customer.addCredit(params.creditToAdd);
      const updateCriteria = new Criteria({
        filter: { customerId: customer.customerId.value },
        options: {
          upsert: false,
        }
      });
      await this.repository.save(updateCriteria, customer);
    } else {
      throw new Error("Customer doesn't exists");
    }
  }
}
