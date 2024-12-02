import { InvalidArgumentError } from '@Shared/domain/value-object/InvalidArgumentError';
import { StringValueObject } from '@Shared/domain/value-object/StringValueObject';

export class CustomerNameLengthExceeded extends InvalidArgumentError { };
export class CustomerNameEmpty extends InvalidArgumentError { };

export class CustomerName extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureLengthIsLessThan50Characters(value);
    this.ensureIsNotEmpty(value);
  }

  private ensureLengthIsLessThan50Characters(value: string): void {
    if (value.length > 50) {
      throw new CustomerNameLengthExceeded(`The Customer Name <${value}> has more than 30 characters`);
    }
  }

  private ensureIsNotEmpty(value: string): void {
    if (!value) {
      throw new CustomerNameEmpty(`The Customer Name is empty`);
    }
  }
}
