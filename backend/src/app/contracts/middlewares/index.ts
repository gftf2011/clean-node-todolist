export interface Middleware {
  handle: (request: any) => Promise<any>;
}
