import { Handler } from '../contracts/handlers';
import { FindUserByEmailAction } from '../actions';
import { EncryptionProvider } from '../contracts/providers';
import { UserRepository } from '../../domain/repositories';
import { UserModel } from '../../domain/models';

export class FindUserByEmailHandler implements Handler<UserModel> {
  readonly operation: string = 'find-user-by-email';

  constructor(
    private readonly encryption: EncryptionProvider,
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(action: FindUserByEmailAction): Promise<UserModel> {
    const { email } = action.data;
    const encryptedEmail = this.encryption.encrypt(email);
    const user = await this.userRepository.findByEmail(encryptedEmail);

    return user;
  }
}
