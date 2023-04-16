import { ApplicationError } from './application';

export class MissingUrlParamsError extends ApplicationError {
  constructor(fields: string[]) {
    super();
    this.message = `missing url parameter(s): [ ${fields.join(', ')} ].`;
    this.name = MissingUrlParamsError.name;
  }
}
