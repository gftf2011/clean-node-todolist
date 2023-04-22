import { UserService } from '../../../../../../src/app/contracts/services';
import { UserDTO } from '../../../../../../src/domain/dto';

type Props = {
  saveUser?: Promise<void>[];
  createSession?: Promise<string>[];
  getUserByEmail?: Promise<UserDTO>[];
  getUser?: Promise<UserDTO>[];
  matchPassword?: Promise<boolean>[];
};

export class UserServiceStub implements UserService {
  private counter1 = 0;

  private counter2 = 0;

  private counter3 = 0;

  private counter4 = 0;

  private counter5 = 0;

  constructor(private readonly props?: Props) {}

  public async saveUser(_user: UserDTO): Promise<void> {
    const response = this.props.saveUser[this.counter1];
    this.counter1++;
    return response;
  }

  public async createSession(_id: string, _email: string): Promise<string> {
    const response = this.props.createSession[this.counter2];
    this.counter2++;
    return response;
  }

  public async getUserByEmail(_email: string): Promise<UserDTO> {
    const response = this.props.getUserByEmail[this.counter3];
    this.counter3++;
    return response;
  }

  public async getUser(_id: string): Promise<UserDTO> {
    const response = this.props.getUser[this.counter4];
    this.counter4++;
    return response;
  }

  public async matchPassword(
    _email: string,
    _password: string,
    _hashedPassword: string,
  ): Promise<boolean> {
    const response = this.props.matchPassword[this.counter5];
    this.counter5++;
    return response;
  }
}
