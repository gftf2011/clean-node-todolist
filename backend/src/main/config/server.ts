import express from 'express';
import setupMiddleware from './middlewares';
import setupRoutest from './routes';

const server = express();

setupMiddleware(server);
setupRoutest(server);

export default server;
