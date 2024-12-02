import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerDelete } from '@Shop/customers/application/Delete/CustomerDelete';
import { CustomerRepository } from '@/contexts/Shop/customers/domain/CustomerRepository';

vi.mock('@Shared/domain/Criteria');

describe('CustomerDelete', () => {
  let repositoryMock: CustomerRepository;
  let customerDelete: CustomerDelete;

  beforeEach(() => {
    repositoryMock = {
      remove: vi.fn(),
    };
    customerDelete = new CustomerDelete(repositoryMock);
  });

  it('should delete a customer without a transaction session', async () => {
    repositoryMock.remove.mockResolvedValue();

    const params = { customerId: 'customer-id-1' };

    await customerDelete.run(params);

    expect(repositoryMock.remove).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { customerId: 'customer-id-1' },
        options: { session: undefined },
      })
    );
  });
});
