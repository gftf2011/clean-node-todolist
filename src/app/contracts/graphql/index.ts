export type GraphqlRequest = {
  args: any;
  context: {
    req?: {
      headers?: any;
    };
  };
};
