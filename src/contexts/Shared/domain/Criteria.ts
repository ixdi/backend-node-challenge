type Primitives = string | number | boolean;

export class Criteria {
  readonly filter: Record<string, Primitives>;
  readonly options: Record<string, unknown> = {};
  readonly sort: Record<string, Primitives> = {};
  readonly skip: number = 0;
  readonly limit: number = 1;

  constructor({
    // Default values
    filter,
    options = {},
    sort = {},
    skip = 0,
    limit = 1,
  }: {
    filter: Record<string, Primitives>,
    options?: Record<string, unknown>,
    sort?: Record<string, Primitives>,
    skip?: number,
    limit?: number,
  }) {
    this.filter = filter;
    this.options = options;
    this.sort = sort;
    this.skip = skip;
    this.limit = limit;
  }

  getOptions() {
    return this.options;
  }

  getFilters() {
    return this.filter;
  }

  getSort() {
    return this.sort;
  }

  getLimit() {
    return this.limit;
  }

  getSkip() {
    return this.skip;
  }

  hasFilters(): boolean {
    return Object.keys(this.filter).length > 0;
  }
}
