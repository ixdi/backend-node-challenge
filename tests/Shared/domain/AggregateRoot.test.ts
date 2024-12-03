import { describe, it, expect, vi } from 'vitest';
import { AggregateRoot } from '@Shared/domain/AggregateRoot';
import { faker } from '@faker-js/faker';

class TestAggregateRoot extends AggregateRoot { }

describe('AggregateRoot', () => {
  it('should record domain events', () => {
    const aggregateRoot = new TestAggregateRoot();
    const mockEvent = { type: 'TestEvent', data: { id: faker.string.uuid() } };

    aggregateRoot.record(mockEvent);

    expect(aggregateRoot.pullDomainEvents()).toEqual([mockEvent]);
  });

  it('should clear domain events after pulling', () => {
    const aggregateRoot = new TestAggregateRoot();
    const mockEvent1 = { type: 'TestEvent1', data: { id: faker.string.uuid() } };
    const mockEvent2 = { type: 'TestEvent2', data: { id: faker.string.uuid() } };

    aggregateRoot.record(mockEvent1);
    aggregateRoot.record(mockEvent2);

    const events = aggregateRoot.pullDomainEvents();
    expect(events).toEqual([mockEvent1, mockEvent2]);
    expect(aggregateRoot.pullDomainEvents()).toEqual([]);
  });

});
