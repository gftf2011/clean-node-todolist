import { Handler } from '../contracts/handlers';
import { CreateUserAction } from '../actions';
import {
  SequencingProvider,
  Sequencers,
  EncryptionProvider,
  HashProvider,
} from '../contracts/providers';
import { UserRepository } from '../../domain/repositories';
import { User } from '../../domain/entity';
import { UserModel } from '../../domain/models';

export class CreateUserHandler implements Handler<void> {
  readonly operation: string = 'create-user';

  constructor(
    private readonly sequencing: SequencingProvider,
    private readonly encryption: EncryptionProvider,
    private readonly hash: HashProvider,
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(action: CreateUserAction): Promise<void> {
    const { data } = action;
    const id = this.sequencing.generateId(Sequencers.USERS);

    const userOrError = User.create(id, data);

    if (userOrError.isLeft()) {
      throw userOrError.value;
    }

    const user = userOrError.value.get();
    const encryptedUser: UserModel = {
      ...user,
      email: this.encryption.encrypt(user.email),
      password: await this.hash.encode(user.password, user.email),
    };

    await this.userRepository.save(encryptedUser);
  }
}
