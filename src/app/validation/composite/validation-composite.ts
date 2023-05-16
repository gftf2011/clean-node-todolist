import { Validator } from '../../contracts/validation';

export class ValidationComposite implements Validator {
  constructor(private readonly validators: Validator[]) {}

  validate(): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const validator of this.validators) {
      validator.validate();
    }
  }
}
