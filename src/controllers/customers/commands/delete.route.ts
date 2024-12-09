import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { z } from 'zod';
import { CustomerDelete } from '@/contexts/Shop/customers/application/Delete/CustomerDelete';
import { getContainer } from '@/dependency-injection';

// Define validation schemas
const customerDeleteSchema = z.object({
  customerId: z.string().uuid(),
});

export class PostCustomerDeleteController implements Controller {
  constructor(private customerDelete: CustomerDelete) { }

  async run(req: Request, res: Response) {
    const { customerId } = req.body;
    const validation = customerDeleteSchema.safeParse({ customerId });
    if (!validation.success) {
      res.status(httpStatus.BAD_REQUEST).send(validation.error);
      return;
    }
    await this.customerDelete.run({
      customerId,
    });
    // 4. Return
    res.status(httpStatus.OK).json({});
  }
}

export const register = async (router: Router) => {
  console.log('Registering customer delete controller');
  const controllerDelete: PostCustomerDeleteController = (await getContainer()).get('Shop.controllers.PostCustomerDeleteController');
  router.post('/v1/customer/delete', (req: Request, res: Response) => controllerDelete.run(req, res));
};
