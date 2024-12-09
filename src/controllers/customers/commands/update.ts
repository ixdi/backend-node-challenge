import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { z } from 'zod';
import { CustomerUpdate } from '@/contexts/Shop/customers/application/Update/CustomerUpdate';
import { getContainer } from '@/dependency-injection';

// Define validation schemas
const customerUpdateSchema = z.object({
  customerId: z.string().uuid(),
  name: z.string().optional(),
  credit: z.number().optional(),
});

export class PostCustomerUpdateController implements Controller {
  constructor(private customerUpdate: CustomerUpdate) { }

  async run(req: Request, res: Response) {
    const { customerId, ...data } = req.body;
    const validation = customerUpdateSchema.safeParse({ customerId, ...data });
    if (!validation.success) {
      res.status(httpStatus.BAD_REQUEST).send(validation.error);
      return;
    }
    await this.customerUpdate.run({ customerId }, data);
    res.status(httpStatus.OK).json({});
  }
}

export const register = async (router: Router) => {
  console.log('Registering customer update controller');
  const controllerUpdate: PostCustomerUpdateController = (await getContainer()).get('Shop.controllers.PostCustomerUpdateController');
  router.post('/v1/customer/update', (req: Request, res: Response) => controllerUpdate.run(req, res));
};
