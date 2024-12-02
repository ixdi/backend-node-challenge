import { AggregateRoot } from '@Shared/domain/AggregateRoot';
import { CustomerId } from '@ModulesShared/domain/CustomerId';
import { CustomerCreatedDomainEvent } from './CustomerCreatedDomainEvent';
import { CustomerCredit } from './CustomerCredit';
import { CustomerName } from './CustomerName';
import { Uuid } from '@Shared/domain/value-object/Uuid';
import { Primitives, PrimitivesWithId } from '@Shared/domain/Primitives';

export class Customer extends AggregateRoot {
  readonly id: Uuid;
  readonly customerId: CustomerId;
  name: CustomerName;
  credit: CustomerCredit;

  constructor(params: PrimitivesWithId<Customer>) {
    super();
    this.id = new Uuid(params.id);
    this.customerId = new CustomerId(params.customerId);
    this.name = new CustomerName(params.name);
    this.credit = new CustomerCredit(params.credit);
  }

  static create(params: Primitives<Customer>): Customer {
    const paramsWithId = { ...params, id: Uuid.random().value };
    const customer = new Customer(paramsWithId);

    customer.record(
      new CustomerCreatedDomainEvent({
        aggregateId: customer.id.value,
        customerId: customer.customerId.value,
        credit: customer.credit.value,
        name: customer.name.value
      })
    );

    return customer;
  }

  toPrimitives(): Primitives<Customer> {
    return {
      customerId: this.customerId.value,
      name: this.name.value,
      credit: this.credit.value
    };
  }

  addCredit(creditToAddPrimitive: number): void {
    const creditToAdd = new CustomerCredit(creditToAddPrimitive);
    this.credit = new CustomerCredit(this.credit.value + creditToAdd.value);
  }
}
