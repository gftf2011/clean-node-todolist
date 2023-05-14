export default `#graphql
  input SignInInput {
    password: String
    email: String
  }

  type SignInOutput {
    accessToken: String
  }

  extend type Query {
    signIn (input: SignInInput): SignInOutput
  }

  input SignUpInput {
    name: String
    lastname: String
    password: String
    email: String
  }

  type SignUpOutput {
    accessToken: String
  }

  extend type Mutation {
    signUp (input: SignUpInput): SignUpOutput
  }
`;
