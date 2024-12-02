import { DBTransaction } from '@Shared/domain/DBTransaction';
import { ClientSession, MongoClient, TransactionOptions } from 'mongodb';

/**
 * If parameter received is a string a new Error is thrown
 * otherwise a new Error with the error message passed is thrown
 * @function handleError
 * @throws new Error from the passed string or error.message
 * @returns {never}
 */
const RESET = '\x1b[0m';
const BRIGHT = '\x1b[1m';
const RED = '\x1b[31m';

export function handleError(err: Error | unknown): never {
  if (typeof err === 'string') {
    const error = new Error(RED + BRIGHT + 'ERROR Mongo Transaction: ' + err + RESET);
    if (process.env.NODE_ENV !== 'production') {
      console.trace();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      error.stack;
    }
    throw error;
  }
  if (err instanceof Error) {
    throw new Error('ERROR Mongo Transaction: ' + err.message);
  }
  throw new Error('Invalid handleError received parameters');
}

export class MongoTransaction implements DBTransaction {
  private client: Promise<MongoClient>;
  private session?: ClientSession;

  constructor(client: Promise<MongoClient>) {
    this.client = client;
  }

  private async getClient(): Promise<MongoClient> {
    return this.client;
  }

  async startTransaction(): Promise<void> {
    const client = await this.getClient();
    this.session = client.startSession();
    try {
      const transactionOptions: TransactionOptions = {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: 'primary',
        // maxCommitTimeMS: 5000,
      };
      this.session.startTransaction(transactionOptions);
    } catch (error) {
      await this.abortTransaction().catch(handleError);
      handleError(error);
    }
  }

  /** End the session so that no further calls can be made on it */
  async stopSession(): Promise<void> {
    if (!this.session) {
      throw new Error('Session is not defined');
    }
    await this.session.endSession()?.catch(handleError);
  }

  private async abortTransaction(): Promise<void> {
    if (!this.session) {
      throw new Error('Session is not defined');
    }
    await this.session.abortTransaction().catch(handleError);
    await this.stopSession().catch(handleError);
  }

  /**
   *  Will proceed with the operation and abort it if there's an error.
   *  At the end it closes the session
   *  It does one retry if something fails
   * */
  async commitTransaction(): Promise<void> {
    if (!this.session) {
      throw new Error('Session is not defined');
    }
    if (this.session.transaction.isStarting) {
      console.log('session is starting when commiting');
    }
    const session = this.session;
    await this.session
      ?.commitTransaction()
      .then(async () => {
        if (session.transaction.isCommitted) {
          console.log('Transaction successfully committed.', session.transaction.isCommitted);
          await this.stopSession().catch(handleError);
        }
      })
      .catch(async (error) => {
        if (error.hasErrorLabel('UnknownTransactionCommitResult')) {
          await session?.commitTransaction();
        } else if (error.hasErrorLabel('TransientTransactionError')) {
          await this.startTransaction();
          await session?.commitTransaction();
        } else {
          console.log(`An error occurred in the transaction, performing a data rollback:${error}`);
          await this.abortTransaction().catch(handleError);
          handleError(error);
        }
      });
  }

  getSession(): ClientSession | undefined {
    return this.session;
  }

  hasTransactionStarted(): boolean {
    return !!this?.session?.transaction?.isActive;
  }
}
