import { DatabaseTransaction } from '../../../../app/contracts/database';

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
  makeIsNoteFinishedHandler,
  makeVerifyTokenHandler,
  makeDeleteNoteHandler,
} from '../../app/handlers';

import { BusMediator } from '../../../../infra/bus';

export const makeBus = (database?: DatabaseTransaction): BusMediator => {
  const handlers = [
    makeCreateAccessTokenHandler(database),
    makeCreateUserHandler(database),
    makeFindUserByEmailHandler(database),
    makeFindUserHandler(database),
    makePasswordMatchHandler(database),
    makeCreateNoteHandler(database),
    makeFindNoteHandler(database),
    makeFindNotesByUserIdHandler(database),
    makeUpdateNoteHandler(database),
    makeIsNoteFinishedHandler(database),
    makeVerifyTokenHandler(database),
    makeDeleteNoteHandler(database),
  ];
  const bus = new BusMediator(handlers);
  return bus;
};
