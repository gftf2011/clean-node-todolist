export interface HttpResponse<Body = any> {
  statusCode: number;
  body?: Body;
}

export interface HttpRequest<Body = any> {
  body?: Body;
  headers?: any;
  params?: any;
}
