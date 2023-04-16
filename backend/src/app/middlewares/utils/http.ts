import { HttpResponse } from '../../contracts/http';

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const unauthorized = (error: Error): HttpResponse => ({
  statusCode: 401,
  body: error,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error,
});

export const serviceUnavailableError = (error: Error): HttpResponse => ({
  statusCode: 503,
  body: error,
});

export const unknown = (error: Error): HttpResponse => ({
  statusCode: 599,
  body: error,
});
