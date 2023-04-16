export interface Controller {
  handle: (request: any) => Promise<any>;
}
