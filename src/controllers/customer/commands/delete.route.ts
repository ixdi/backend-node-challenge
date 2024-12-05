import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { MongoClientFactory } from '@/contexts/Shared/infrastructure/persistence/mongo/MongoClient';
import { MongoCustomerRepository } from '@/contexts/Shop/customers/infrastructure/persistence/MongoCustomerRepository';
import { z } from 'zod';
import { CustomerDelete } from '@/contexts/Shop/customers/application/Delete/CustomerDelete';

// Define validation schemas
const customerDeleteSchema = z.object({
  customerId: z.string().uuid(),
});

export class PostCustomerDeleteController implements Controller {
  async run(req: Request, res: Response) {
    // 1. Validate data
    const { customerId } = req.body;
    const validation = customerDeleteSchema.safeParse({ customerId });
    if (!validation.success) {
      res.status(httpStatus.BAD_REQUEST).send(validation.error);
      return;
    }
    // 2. Create connection
    const connection = await MongoClientFactory.createClient('motorbikeshop', {
      url: process.env.MONGODB_URI || '',
    });
    const customerRepository = new MongoCustomerRepository(connection);
    // 3. Run use case
    const customerDelete = new CustomerDelete(customerRepository);
    await customerDelete.run({
      customerId,
    });
    // 4. Return
    res.status(httpStatus.OK).json({});
  }
}

export const register = (router: Router) => {
  const controller = new PostCustomerDeleteController();
  router.post('/v1/customer/delete', (req: Request, res: Response) => controller.run(req, res));
};
