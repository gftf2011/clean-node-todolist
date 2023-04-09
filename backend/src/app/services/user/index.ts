import { UserDTO } from '../../../domain/dto';
import { UserModel } from '../../../domain/models';
import {
  CreateAccessTokenAction,
  CreateUserAction,
  FindUserAction,
  FindUserByEmailAction,
  PasswordMatchAction,
} from '../../actions';
import { Bus } from '../../contracts/bus';
import { UserService } from '../../contracts/services';

export class UserServiceImpl implements UserService {
  constructor(private readonly bus: Bus) {}

  public async saveUser(user: UserDTO): Promise<void> {
    const action = new CreateUserAction({ ...user });
    await this.bus.execute(action);
    return;
  }

  public async createSession(id: string, email: string): Promise<string> {
    const action = new CreateAccessTokenAction({
      email,
      id,
    });
    const response = await this.bus.execute(action);

    return response as string;
  }

  public async getUserByEmail(email: string): Promise<UserModel> {
    const action = new FindUserByEmailAction({
      email,
    });
    const response = await this.bus.execute(action);

    return response as UserModel;
  }

  public async getUser(id: string): Promise<UserModel> {
    const action = new FindUserAction({
      id,
    });
    const response = await this.bus.execute(action);

    return response as UserModel;
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
}
