import {
  makeCreateAccessTokenHandler,
  makeCreateUserHandler,
  makeFindUserByEmailHandler,
  makeFindUserHandler,
  makePasswordMatchHandler,
  makeCreateNoteHandler,
  makeFindNoteHandler,
  makeFindNotesByUserIdHandler,
  makeUpdateNoteHandler,
} from '../../app/handlers';

import { BusMediator } from '../../../../infra/bus';

export const makeBus = (): BusMediator => {
  const handlers = [
    makeCreateAccessTokenHandler(),
    makeCreateUserHandler(),
    makeFindUserByEmailHandler(),
    makeFindUserHandler(),
    makePasswordMatchHandler(),
    makeCreateNoteHandler(),
    makeFindNoteHandler(),
    makeFindNotesByUserIdHandler(),
    makeUpdateNoteHandler(),
  ];
  const bus = new BusMediator(handlers);
  return bus;
};
