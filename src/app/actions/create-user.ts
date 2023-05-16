import { UserDTO } from '../../domain/dto';
import { Action } from '../contracts/actions';

type CreateUserData = UserDTO;

// It uses the command design pattern
export class CreateUserAction implements Action {
  readonly operation: string = 'create-user';

  constructor(public readonly data: CreateUserData) {}
}
