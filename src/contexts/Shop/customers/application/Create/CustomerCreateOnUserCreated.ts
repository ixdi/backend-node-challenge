import { DomainEventClass } from '@Shared/domain/DomainEvent';
import { DomainEventSubscriber } from '@Shared/domain/DomainEventSubscriber';
import { CustomerCreatedDomainEvent } from '@Shop/customers/domain/CustomerCreatedDomainEvent';
import { CustomerCreate } from './CustomerCreate';

export class CreateCustomerOnUserCreated implements DomainEventSubscriber<CustomerCreatedDomainEvent> {
  constructor(private customer: CustomerCreate) { }

  subscribedTo(): DomainEventClass[] {
    return [CustomerCreatedDomainEvent];
  }

  async on(domainEvent: CustomerCreatedDomainEvent) {
    await this.customer.run(domainEvent.toPrimitives());
  }
}
