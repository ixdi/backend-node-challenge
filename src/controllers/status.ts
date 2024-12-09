import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from './Controller';
import { getContainer } from '@/dependency-injection';

export class StatusGetController implements Controller {
  async run(req: Request, res: Response) {
    res.status(httpStatus.OK).send();
  }
}

export const register = async (router: Router) => {
  console.log('Registering status controller');
  const controllerStatus: StatusGetController = (await getContainer()).get('Shop.controllers.StatusGetController');
  router.get('/status', (req: Request, res: Response) => controllerStatus.run(req, res));
};
