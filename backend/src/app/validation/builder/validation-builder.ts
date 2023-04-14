import { Validator } from '../../contracts/validation';
import {
  RequiredParamString,
  RequiredParam,
  FieldOrigin,
} from './required-param';

type ValidatedField = {
  value: any;
  fieldName: string;
  fieldOrigin: FieldOrigin;
};

export class ValidationBuilder {
  private fields: ValidatedField[] = [];

  private validators: Validator[] = [];

  private constructor() {}

  static of(): ValidationBuilder {
    return new ValidationBuilder();
  }

  required(): ValidationBuilder {
    // eslint-disable-next-line no-restricted-syntax
    for (const field of this.fields) {
      if (typeof field.value === 'string') {
        this.validators.push(
          new RequiredParamString(
            field.value,
            field.fieldName,
            field.fieldOrigin,
          ),
        );
      } else {
        this.validators.push(
          new RequiredParam(field.value, field.fieldName, field.fieldOrigin),
        );
      }
    }
    return this;
  }

  and(fields: ValidatedField): ValidationBuilder {
    this.fields.push(fields);
    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}
