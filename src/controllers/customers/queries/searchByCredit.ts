import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { z } from 'zod';
import { CustomerSearchByCredit } from '@/contexts/Shop/customers/application/SearchByCredit/CustomerSearchByCredit';
import { getContainer } from '@/dependency-injection';

// Define validation schemas
const customerSearchByCreditSchema = z.object({
});

export class GetCustomerSearchByCreditController implements Controller {
  constructor(private customerSearchByCredit: CustomerSearchByCredit) { }

  async run(req: Request, res: Response) {
    const body = req.body;
    const validation = customerSearchByCreditSchema.safeParse(body);
    if (!validation.success) {
      res.status(httpStatus.BAD_REQUEST).send(validation.error);
      return;
    }
    const customersPrimitives = await this.customerSearchByCredit.run();
    res.status(httpStatus.OK).json({
      customers: customersPrimitives,
    });
  }
}

export const register = async (router: Router) => {
  console.log('Registering customer search by credit controller');
  router.get('/v1/customer/search-by-credit', async (req: Request, res: Response) => {
    console.log('Running customer search by credit controller');
    const container = await getContainer();
    const controllerSearchByCredit: GetCustomerSearchByCreditController = container.get('Shop.controllers.GetCustomerSearchByCreditController');
    return await controllerSearchByCredit.run(req, res)
  });
};
