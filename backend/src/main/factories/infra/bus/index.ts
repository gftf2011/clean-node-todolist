import {
  makeCreateAccessTokenHandler,
  makeCreateUserHandler,
  makeFindUserByEmailHandler,
} from '../../app/handlers';

import { BusMediator } from '../../../../infra/bus';

export const makeBus = (): BusMediator => {
  const handlers = [
    makeCreateAccessTokenHandler(),
    makeCreateUserHandler(),
    makeFindUserByEmailHandler(),
  ];
  const bus = new BusMediator(handlers);
  return bus;
};
