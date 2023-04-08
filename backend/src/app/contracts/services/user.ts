import { UserDTO } from '../../../domain/dto';
import { UserModel } from '../../../domain/models';

export interface UserService {
  saveUser: (user: UserDTO) => Promise<void>;
  createSession: (id: string, email: string) => Promise<string>;
  getUserByEmail: (email: string) => Promise<UserModel>;
  matchPassword: (
    email: string,
    password: string,
    hashedPassword: string,
  ) => Promise<boolean>;
}
