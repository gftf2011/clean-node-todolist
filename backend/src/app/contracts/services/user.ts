import { UserDTO } from '../../../domain/dto';

export interface UserService {
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
