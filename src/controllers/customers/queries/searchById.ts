import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { z } from 'zod';
import { CustomerSearchById } from '@/contexts/Shop/customers/application/SearchById/CustomerSearchById';
import { getContainer } from '@/dependency-injection';

// Define validation schemas
const customerSearchByIdSchema = z.object({
  customerId: z.string().uuid(),
});

export class GetCustomerSearchByIdController implements Controller {
  constructor(private customerSearchById: CustomerSearchById) { }

  async run(req: Request, res: Response) {
    const customerId = req.body.customerId;
    const validation = customerSearchByIdSchema.safeParse({ customerId });
    if (!validation.success) {
      res.status(httpStatus.BAD_REQUEST).send(validation.error);
      return;
    }
    const customerPrimitives = await this.customerSearchById.run({
      customerId,
    });
    if (!customerPrimitives.length) {
      res.status(httpStatus.NOT_FOUND).send();
      return
    }
    res.status(httpStatus.OK).json(
      customerPrimitives.at(0),
    );
  }
}

export const register = async (router: Router) => {
  console.log('Registering customer search by id controller');
  const controllerSearchById: GetCustomerSearchByIdController = (await getContainer()).get('Shop.controllers.GetCustomerSearchByIdController');
  router.get('/v1/customer/search', (req: Request, res: Response) => controllerSearchById.run(req, res));
};
