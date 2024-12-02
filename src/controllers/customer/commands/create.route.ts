import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { MongoClientFactory } from '@/contexts/Shared/infrastructure/persistence/mongo/MongoClient';
import { MongoCustomerRepository } from '@/contexts/Shop/customers/infrastructure/persistence/MongoCustomerRepository';
import { z } from 'zod';
import { CustomerCreate } from '@/contexts/Shop/customers/application/Create/CustomerCreate';
import { CustomerId } from '@/contexts/Shop/Shared/domain/CustomerId';

// Define validation schemas
const customerCreateSchema = z.object({
  name: z.string(),
  credit: z.number().optional(),
});

class PostCustomerCreateController implements Controller {
  async run(req: Request, res: Response) {
    console.log(req.body);
    // 1. Validate data
    const { name, credit } = req.body;
    const validation = customerCreateSchema.safeParse({ name, credit });
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
    const customerCreate = new CustomerCreate(customerRepository);
    const customerId = CustomerId.random().value;
    customerCreate.run({
      customerId,
      name,
      credit,
    });
    // 4. Return customerId
    res.status(httpStatus.OK).send({
      customerId,
    });
  }
}

export const register = (router: Router) => {
  const controller = new PostCustomerCreateController();
  router.post('/v1/customer/create', (req: Request, res: Response) => controller.run(req, res));
};
