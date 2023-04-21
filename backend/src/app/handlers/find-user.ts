import { Handler } from '../contracts/handlers';
import { FindUserAction } from '../actions';
import { DecryptionProvider } from '../contracts/providers';
import { UserRepository } from '../../domain/repositories';
import { UserDTO } from '../../domain/dto';

export class FindUserHandler implements Handler<UserDTO> {
  readonly operation: string = 'find-user';

  constructor(
    private readonly decryption: DecryptionProvider,
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(action: FindUserAction): Promise<UserDTO> {
    const { id } = action.data;
    const user = await this.userRepository.find(id);
    const decryptedUser = user
      ? {
          ...user,
          email: this.decryption.decrypt(user.email),
        }
      : null;

    return decryptedUser;
  }
}
