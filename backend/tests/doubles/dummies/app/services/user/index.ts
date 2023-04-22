import { UserService } from '../../../../../../src/app/contracts/services';
import { UserDTO } from '../../../../../../src/domain/dto';

export class UserServiceDummy implements UserService {
  saveUser: (user: UserDTO) => Promise<void>;

  createSession: (id: string, email: string) => Promise<string>;

  getUserByEmail: (email: string) => Promise<UserDTO>;

  getUser: (id: string) => Promise<UserDTO>;

  matchPassword: (
    email: string,
    password: string,
    hashedPassword: string,
  ) => Promise<boolean>;
}
