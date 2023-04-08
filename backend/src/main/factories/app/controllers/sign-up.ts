import { SignUpController } from '../../../../app/controllers';
import { UserServiceImpl } from '../../../../app/services';
import { makeBus } from '../../infra/bus';

export const makeSignUpController = (): SignUpController => {
  const bus = makeBus();
  const userService = new UserServiceImpl(bus);
  const controller = new SignUpController(userService);

  return controller;
};
