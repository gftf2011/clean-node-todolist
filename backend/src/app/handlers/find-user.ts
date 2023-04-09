import { Handler } from '../contracts/handlers';
import { FindUserAction } from '../actions';
import { DecryptionProvider } from '../contracts/providers';
import { UserRepository } from '../../domain/repositories';
import { UserModel } from '../../domain/models';

export class FindUserHandler implements Handler<UserModel> {
  readonly operation: string = 'find-user';

  constructor(
    private readonly decryption: DecryptionProvider,
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(action: FindUserAction): Promise<UserModel> {
    const { id } = action.data;
    const user = await this.userRepository.find(id);
    const decryptedUser = {
      ...user,
      email: this.decryption.decrypt(user.email),
    };

    return decryptedUser;
  }
}
