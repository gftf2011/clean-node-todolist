import { UserDTO } from '../../../../../src/domain/dto';

import { Handler } from '../../../../../src/app/contracts/handlers';
import { FindUserByEmailAction } from '../../../../../src/app/actions';

type Props = {
  users?: UserDTO[];
};

type Info = {
  calls: number;
  data: FindUserByEmailAction[];
};

export class FindUserByEmailHandlerSpy implements Handler<UserDTO> {
  private counter1 = 0;

  private info: Info = {
    calls: 0,
    data: [],
  };

  operation = 'find-user-by-email';

  constructor(private readonly props?: Props) {}

  public getInfo(): Info {
    return this.info;
  }

  public async handle(input: FindUserByEmailAction): Promise<UserDTO> {
    const response = this.props.users[this.counter1];
    this.counter1++;

    this.info.data.push(input);
    this.info.calls = this.counter1;

    return response;
  }
}
