// NOTE: Assume an import from intfrastructure to not complicate the code
import { ClientSession } from "mongodb";

export interface DBTransaction {
  startTransaction(): Promise<void>;
  stopSession(): Promise<void>;
  commitTransaction(): Promise<void>;
  getSession(): ClientSession | undefined;
}

export type TransactionSession = ClientSession;
