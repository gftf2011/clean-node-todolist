/* eslint-disable max-classes-per-file */
import { Validator } from '../../contracts/validation';
import {
  MissingHeaderParamsError,
  MissingBodyParamsError,
  MissingUrlParamsError,
} from '../../errors';

export enum FieldOrigin {
  BODY = 'BODY',
  HEADER = 'HEADER',
  URL = 'URL',
}

export class RequiredParam implements Validator {
  constructor(
    readonly value: any,
    readonly fieldName: string,
    readonly fieldOrigin: FieldOrigin,
  ) {}

  validate(): void {
    if (
      this.fieldOrigin === FieldOrigin.HEADER &&
      (this.value === null || this.value === undefined)
    ) {
      throw new MissingHeaderParamsError([this.fieldName]);
    } else if (
      this.fieldOrigin === FieldOrigin.BODY &&
      (this.value === null || this.value === undefined)
    ) {
      throw new MissingBodyParamsError([this.fieldName]);
    } else if (
      this.fieldOrigin === FieldOrigin.URL &&
      (this.value === null || this.value === undefined)
    ) {
      throw new MissingUrlParamsError([this.fieldName]);
    }
  }
}

export class RequiredParamString extends RequiredParam {
  constructor(
    override readonly value: string,
    override readonly fieldName: string,
    override readonly fieldOrigin: FieldOrigin,
  ) {
    super(value, fieldName, fieldOrigin);
  }

  override validate(): void {
    if (
      this.fieldOrigin === FieldOrigin.HEADER &&
      (this.value === null || this.value === undefined || this.value === '')
    ) {
      throw new MissingHeaderParamsError([this.fieldName]);
    } else if (
      this.fieldOrigin === FieldOrigin.BODY &&
      (this.value === null || this.value === undefined || this.value === '')
    ) {
      throw new MissingBodyParamsError([this.fieldName]);
    } else if (
      this.fieldOrigin === FieldOrigin.URL &&
      (this.value === null || this.value === undefined || this.value === '')
    ) {
      throw new MissingUrlParamsError([this.fieldName]);
    }
  }
}
