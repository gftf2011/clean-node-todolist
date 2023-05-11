import { Response } from '../../contracts/response';

export const ok = (data: any): Response => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): Response => ({
  statusCode: 201,
  body: data,
});

export const noContent = (): Response => ({
  statusCode: 204,
});

export const unauthorized = (error: Error): Response => ({
  statusCode: 401,
  body: error,
});

export const forbidden = (error: Error): Response => ({
  statusCode: 403,
  body: error,
});

export const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error,
});

export const serverError = (error: Error): Response => ({
  statusCode: 500,
  body: error,
});

export const serviceUnavailableError = (error: Error): Response => ({
  statusCode: 503,
  body: error,
});

export const unknown = (error: Error): Response => ({
  statusCode: 599,
  body: error,
});
