import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { z } from 'zod';
import { CustomerCreate } from '@/contexts/Shop/customers/application/Create/CustomerCreate';
import { CustomerId } from '@/contexts/Shop/Shared/domain/CustomerId';
import { getContainer } from '@/dependency-injection';

// Define validation schemas
const customerCreateSchema = z.object({
  name: z.string(),
  credit: z.number().optional(),
});

export class PostCustomerCreateController implements Controller {
  constructor(private customerCreate: CustomerCreate) { }

  async run(req: Request, res: Response) {
    const { name, credit } = req.body;
    const validation = customerCreateSchema.safeParse({ name, credit });
    if (!validation.success) {
      res.status(httpStatus.BAD_REQUEST).send(validation.error);
      return;
    }
    const customerId = CustomerId.random().value;
    await this.customerCreate.run({
      customerId,
      name,
      credit,
    });
    res.status(httpStatus.OK).json({
      customerId,
    });
  }
}

export const register = async (router: Router) => {
  console.log('Registering customer create controller');
  router.post('/v1/customer/create', async (req: Request, res: Response) => {
    console.log('Running customer create controller');
    const container = await getContainer();
    const controllerCreate: PostCustomerCreateController = container.get('Shop.controllers.PostCustomerCreateController')
    await controllerCreate.run(req, res);
  })
};
