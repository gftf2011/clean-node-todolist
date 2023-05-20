import { UserDTO } from '../../domain/dto';
import {
  CreateAccessTokenAction,
  CreateUserAction,
  FindUserAction,
  FindUserByEmailAction,
  PasswordMatchAction,
  VerifyTokenAction,
} from '../actions';
import { Bus } from '../contracts/bus';
import { UserService } from '../contracts/services';

export class UserServiceImpl implements UserService {
  constructor(private readonly bus: Bus) {}

  public async saveUser(user: UserDTO): Promise<void> {
    const action = new CreateUserAction({ ...user });
    await this.bus.execute(action);
  }

  public async createSession(id: string, email: string): Promise<string> {
    const action = new CreateAccessTokenAction({
      email,
      id,
    });
    const response = await this.bus.execute(action);

    return response as string;
  }

  public async getUserByEmail(email: string): Promise<UserDTO> {
    const action = new FindUserByEmailAction({
      email,
    });
    const response = await this.bus.execute(action);

    return response as UserDTO;
  }

  public async getUser(id: string): Promise<UserDTO> {
    const action = new FindUserAction({
      id,
    });
    const response = await this.bus.execute(action);

    return response as UserDTO;
  }

  public async matchPassword(
    email: string,
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const action = new PasswordMatchAction({
      email,
      password,
      hashedPassword,
    });
    const response = await this.bus.execute(action);

    return response as boolean;
  }

  public async validateToken(
    token: string,
  ): Promise<{ id: string; sub: string }> {
    const action = new VerifyTokenAction({
      token,
    });
    const response = await this.bus.execute(action);

    return response as { id: string; sub: string };
  }
}
