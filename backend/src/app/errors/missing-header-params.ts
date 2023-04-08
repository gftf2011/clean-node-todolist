import { ApplicationError } from './application';

export class MissingHeaderParamsError extends ApplicationError {
  constructor(fields: string[]) {
    super();
    this.message = `missing headers parameter(s): [ ${fields.join(', ')} ].`;
    this.name = MissingHeaderParamsError.name;
  }
}
