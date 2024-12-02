import { expect, describe, test } from 'vitest';
import { Criteria } from "@Shared/domain/Criteria";

describe('Criteria', () => {
  test('Creates a criteria with filter, options, sort, skip and limit', () => {
    const criteria = new Criteria({
      filter: { name: 'Aina' },
      options: { projection: { name: 1 } },
      sort: { name: 1 },
      skip: 0,
      limit: 10
    });

    expect(criteria.getFilters()).toEqual({ name: 'Aina' });
    expect(criteria.getOptions()).toEqual({ projection: { name: 1 } });
    expect(criteria.getSort()).toEqual({ name: 1 });
    expect(criteria.getSkip()).toBe(0);
    expect(criteria.getLimit()).toBe(10);
  });

  test('Creates a criteria with filter, options, sort, skip and limit by default', () => {
    const criteria = new Criteria({
      filter: { name: 'Aina' }
    });

    expect(criteria.getFilters()).toEqual({ name: 'Aina' });
    expect(criteria.getOptions()).toEqual({});
    expect(criteria.getSort()).toEqual({});
    expect(criteria.getSkip()).toBe(0);
    expect(criteria.getLimit()).toBe(1);
  });

  test('Checks if the criteria has no filters', () => {
    const criteria = new Criteria({
      filter: { name: 'Aina' }
    });

    expect(criteria.getOptions()).toEqual({});
  })

  test('Checks if the criteria has filters', () => {
    const criteria = new Criteria({
      filter: { name: 'Aina' }
    });

    expect(criteria.hasFilters()).toBe(true);
  });
});
