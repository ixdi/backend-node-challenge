import { InvalidArgumentError } from '@Shared/domain/value-object/InvalidArgumentError';
import { NumberValueObject } from '@Shared/domain/value-object/IntValueObject';

export class CustomerCreditIsInvalid extends InvalidArgumentError { };

export class CustomerCredit extends NumberValueObject {
  constructor(value?: number) {
    super(value || 0);
    this.ensureIsNotNegative(this.value);
  }

  private ensureIsNotNegative(value: number): void {
    if (value < 0) {
      throw new CustomerCreditIsInvalid(`The Customer Credit <${value}> is less than 0`);
    }
  }
}
