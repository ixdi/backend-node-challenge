import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { MongoClientFactory } from '@/contexts/Shared/infrastructure/persistence/mongo/MongoClient';
import { MongoCustomerRepository } from '@/contexts/Shop/customers/infrastructure/persistence/MongoCustomerRepository';
import { z } from 'zod';
import { CustomerUpdate } from '@/contexts/Shop/customers/application/Update/CustomerUpdate';

// Define validation schemas
const customerUpdateSchema = z.object({
  customerId: z.string().uuid(),
  name: z.string().optional(),
  credit: z.number().optional(),
});

class PostCustomerUpdateController implements Controller {
  async run(req: Request, res: Response) {
    // 1. Validate data
    const { customerId, ...data } = req.body;
    const validation = customerUpdateSchema.safeParse({ customerId, ...data });
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
    const customerUpdate = new CustomerUpdate(customerRepository);
    await customerUpdate.run({ customerId }, data);
    // 4. Return
    res.status(httpStatus.OK).json({});
  }
}

export const register = (router: Router) => {
  const controller = new PostCustomerUpdateController();
  router.post('/v1/customer/update', (req: Request, res: Response) => controller.run(req, res));
};
