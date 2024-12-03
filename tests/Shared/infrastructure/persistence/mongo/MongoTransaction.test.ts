import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoTransaction, handleError } from '@Shared/infrastructure/persistence/mongo/MongoTransaction';

describe('MongoTransaction', () => {
  let mongoClientMock;
  let sessionMock;
  let transaction;

  beforeEach(() => {
    sessionMock = {
      startTransaction: vi.fn(),
      endSession: vi.fn(),
      abortTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      transaction: { isActive: true, isCommitted: false, isStarting: true },
    };

    mongoClientMock = {
      startSession: vi.fn(() => sessionMock),
    };

    transaction = new MongoTransaction(Promise.resolve(mongoClientMock));
  });

  it('should start a transaction', async () => {
    await transaction.startTransaction();

    expect(mongoClientMock.startSession).toHaveBeenCalled();
    expect(sessionMock.startTransaction).toHaveBeenCalledWith({
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
      readPreference: 'primary',
    });
  });

  it('should stop a session', async () => {
    await transaction.startTransaction();
    await transaction.stopSession();

    expect(sessionMock.endSession).toHaveBeenCalled();
  });

  it('should throw an error when stopping a session without starting it', async () => {
    await expect(transaction.stopSession()).rejects.toThrow('Session is not defined');
  });

  it('should abort a transaction', async () => {
    await transaction.startTransaction();
    await transaction.abortTransaction();

    expect(sessionMock.abortTransaction).toHaveBeenCalled();
    expect(sessionMock.endSession).toHaveBeenCalled();
  });

  it('should commit a transaction successfully', async () => {
    sessionMock.commitTransaction.mockResolvedValueOnce();

    await transaction.startTransaction();
    await transaction.commitTransaction();

    expect(sessionMock.commitTransaction).toHaveBeenCalled();
  });

  it('should handle transient transaction errors and retry committing', async () => {
    const transientError = {
      hasErrorLabel: (label) => label === 'TransientTransactionError',
    };
    sessionMock.commitTransaction.mockRejectedValueOnce(transientError);
    sessionMock.commitTransaction.mockResolvedValueOnce();

    await transaction.startTransaction();
    await transaction.commitTransaction();

    expect(sessionMock.commitTransaction).toHaveBeenCalledTimes(2);
  });

  it('should handle unknown commit result errors and retry committing', async () => {
    const unknownCommitResultError = {
      hasErrorLabel: (label) => label === 'UnknownTransactionCommitResult',
    };
    sessionMock.commitTransaction.mockRejectedValueOnce(unknownCommitResultError);
    sessionMock.commitTransaction.mockResolvedValueOnce();

    await transaction.startTransaction();
    await transaction.commitTransaction();

    expect(sessionMock.commitTransaction).toHaveBeenCalledTimes(2);
  });

  it('should handle errors during commit and abort transaction', async () => {
    const fatalError = {
      hasErrorLabel: () => false,
      message: 'Fatal error',
    };
    sessionMock.commitTransaction.mockRejectedValueOnce(fatalError);

    await transaction.startTransaction();

    await expect(transaction.commitTransaction()).rejects.toThrow('Fatal error');

    expect(sessionMock.abortTransaction).toHaveBeenCalled();
    expect(sessionMock.endSession).toHaveBeenCalled();
  });

  it('should verify if a transaction has started', async () => {
    expect(transaction.hasTransactionStarted()).toBe(false);

    await transaction.startTransaction();

    expect(transaction.hasTransactionStarted()).toBe(true);
  });

  it('should throw an error using handleError function', () => {
    expect(() => handleError('Test error')).toThrow('ERROR Mongo Transaction: Test error');
    expect(() => handleError(new Error('Test error object'))).toThrow('ERROR Mongo Transaction: Test error object');
  });
});
