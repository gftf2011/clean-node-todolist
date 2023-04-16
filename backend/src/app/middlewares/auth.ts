import { DecryptionProvider, TokenProvider } from '../contracts/providers';
import { HttpRequest, HttpResponse } from '../contracts/http';
import { TemplateMiddleware } from './template';
import { UserRepository } from '../../domain/repositories';
import { Either, left, right } from '../../shared';
import {
  InvalidTokenSubjectError,
  TokenExpiredError,
  UserDoesNotExistsError,
} from '../errors';
import { Validator } from '../contracts/validation';
import { FieldOrigin, ValidationBuilder } from '../validation';
import { ok } from './utils';

export class AuthMiddleware extends TemplateMiddleware {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly decryptionProvider: DecryptionProvider,
    private readonly userRepository: UserRepository,
    private readonly secret: string,
  ) {
    super();
  }

  protected override buildHeaderValidators(
    request: HttpRequest<any>,
  ): Validator[] {
    return [
      ...ValidationBuilder.of()
        .and({
          value: request.headers.authorization,
          fieldName: 'authorization',
          fieldOrigin: FieldOrigin.HEADER,
        })
        .required()
        .build(),
    ];
  }

  private verifyTokenExpiration(
    jwt: string,
  ): Either<Error, { id: string; sub: string }> {
    try {
      const token: { id: string; sub: string } = this.tokenProvider.verify(
        jwt,
        this.secret,
      );
      return right(token);
    } catch (err) {
      return left(new TokenExpiredError());
    }
  }

  protected async perform(
    request: HttpRequest<any>,
  ): Promise<HttpResponse<{ userId: string }>> {
    const jwt = request.headers.authorization.split('Bearer ')[1];
    const tokenOrError = this.verifyTokenExpiration(jwt);

    if (tokenOrError.isLeft()) throw tokenOrError.value;

    const jwtToken = tokenOrError.value;
    const user = await this.userRepository.find(jwtToken.id);

    if (!user) throw new UserDoesNotExistsError();

    const decryptedSubject = this.decryptionProvider.decrypt(jwtToken.sub);

    if (decryptedSubject !== user.email) throw new InvalidTokenSubjectError();

    return ok({ userId: jwtToken.id });
  }
}
