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
  router.get('/status', async (req: Request, res: Response) => {
    console.log('Running status controller');
    const container = await getContainer();
    const controllerStatus: StatusGetController = container.get('Shop.controllers.StatusGetController');
    await controllerStatus.run(req, res)
  });
};
