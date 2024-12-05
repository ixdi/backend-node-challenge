import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from './Controller';

export class StatusGetController implements Controller {
  async run(req: Request, res: Response) {
    res.status(httpStatus.OK).send();
  }
}

export const register = (router: Router) => {
  const controller = new StatusGetController();
  router.get('/status', (req: Request, res: Response) => controller.run(req, res));
};
