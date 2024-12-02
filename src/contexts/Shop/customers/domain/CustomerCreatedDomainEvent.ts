import { DomainEvent } from '@Shared/domain/DomainEvent';

type CreateCustomerDomainEventAttributes = {
  readonly customerId: string;
  readonly name: string;
  readonly credit: number;
};

export class CustomerCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'shop.customer.created';

  readonly customerId: string;
  readonly credit: number;
  readonly name: string;

  constructor({
    aggregateId,
    customerId,
    name,
    credit,
    eventId,
    occurredOn
  }: {
    aggregateId: string;
    eventId?: string;
    customerId: string;
    name: string;
    credit: number;
    occurredOn?: Date;
  }) {
    super({ eventName: CustomerCreatedDomainEvent.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.customerId = customerId;
    this.name = name;
    this.credit = credit;
  }

  toPrimitives(): CreateCustomerDomainEventAttributes {
    const { customerId, name, credit } = this;
    return {
      customerId,
      name,
      credit,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: CreateCustomerDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new CustomerCreatedDomainEvent({
      aggregateId,
      customerId: attributes.customerId,
      name: attributes.name,
      credit: attributes.credit,
      eventId,
      occurredOn
    });
  }
}
