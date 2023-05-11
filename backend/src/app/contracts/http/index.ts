export type HttpRequest<Body = any> = {
  body?: Body;
  headers?: any;
  params?: any;
};
