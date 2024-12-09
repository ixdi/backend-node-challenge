import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { z } from 'zod';
import { CustomerAddCredit } from '@/contexts/Shop/customers/application/AddCredit/CustomerAddCredit';
import { getContainer } from '@/dependency-injection';

// Define validation schemas
const customerAddCreditSchema = z.object({
  customerId: z.string().uuid(),
  creditToAdd: z.number(),
});

export class PostCustomerAddCreditController implements Controller {
  constructor(private customerAddCredit: CustomerAddCredit) { }

  async run(req: Request, res: Response) {
    const { customerId, creditToAdd } = req.body;
    const validation = customerAddCreditSchema.safeParse({ customerId, creditToAdd });
    if (!validation.success) {
      res.status(httpStatus.BAD_REQUEST).send(validation.error);
      return;
    }
    await this.customerAddCredit.run({
      customerId,
      creditToAdd,
    });
    // 4. Return
    res.status(httpStatus.OK).json({});
  }
}

export const register = async (router: Router) => {
  console.log('Registering customer add credit controller');
  router.post('/v1/customer/add-credit', async (req: Request, res: Response) => {
    console.log('Running customer add credit controller');
    const container = await getContainer();
    const controllerAddCredit: PostCustomerAddCreditController = container.get('Shop.controllers.PostCustomerAddCreditController');
    return await controllerAddCredit.run(req, res)
  });
};
