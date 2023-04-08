export type TokenPayload = {
  payload: any;
  secret: string;
  subject: string;
};

export interface TokenProvider {
  sign: (data: TokenPayload) => string;
  verify: (token: string, secret: string) => any;
}
