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
  const controllerSearchByCredit: GetCustomerSearchByCreditController = (await getContainer()).get('Shop.controllers.GetCustomerSearchByCreditController');
  router.get('/v1/customer/search-by-credit', (req: Request, res: Response) => controllerSearchByCredit.run(req, res));
};
