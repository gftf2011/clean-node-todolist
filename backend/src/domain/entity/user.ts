import { Either, left, right } from '../../shared';

import { Email, Password, ID, Lastname, Name } from '../value-objects';

type Props = {
  id: string;
  email: string;
  password: string;
  name: string;
  lastname: string;
};

type Input = {
  email: string;
  password: string;
  name: string;
  lastname: string;
};

type Output = {
  id: string;
  email: string;
  password: string;
  name: string;
  lastname: string;
};

export class User {
  private constructor(private readonly value: Props) {}

  public get(): Output {
    const { email, password, id, lastname, name } = this.value;
    const user: Output = {
      id,
      email,
      password,
      name,
      lastname,
    };
    return user;
  }

  public static create(id: string, user: Input): Either<Error, User> {
    const { email, password, lastname, name } = user;

    const idOrError = ID.create(id);
    const nameOrError = Name.create(name);
    const lastnameOrError = Lastname.create(lastname);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password);

    if (idOrError.isLeft()) {
      return left(idOrError.value);
    }

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (lastnameOrError.isLeft()) {
      return left(lastnameOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    return right(
      new User({
        id: idOrError.value.get(),
        email: emailOrError.value.get(),
        password: passwordOrError.value.get(),
        lastname: lastnameOrError.value.get(),
        name: nameOrError.value.get(),
      }),
    );
  }
}
