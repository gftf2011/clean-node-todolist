import { Handler } from '../contracts/handlers';
import { FindUserByEmailAction } from '../actions';
import { DecryptionProvider, EncryptionProvider } from '../contracts/providers';
import { UserRepository } from '../../domain/repositories';
import { UserDTO } from '../../domain/dto';

export class FindUserByEmailHandler implements Handler<UserDTO> {
  readonly operation: string = 'find-user-by-email';

  constructor(
    private readonly encryption: EncryptionProvider,
    private readonly decryption: DecryptionProvider,
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(action: FindUserByEmailAction): Promise<UserDTO> {
    const { email } = action.data;
    const encryptedEmail = this.encryption.encrypt(email);
    const user = await this.userRepository.findByEmail(encryptedEmail);
    const decryptedUser = {
      ...user,
      email: this.decryption.decrypt(user.email),
    };

    return decryptedUser;
  }
}
