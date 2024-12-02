import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { MongoClientFactory } from '@/contexts/Shared/infrastructure/persistence/mongo/MongoClient';
import { MongoCustomerRepository } from '@/contexts/Shop/customers/infrastructure/persistence/MongoCustomerRepository';
import { z } from 'zod';
import { CustomerAddCredit } from '@/contexts/Shop/customers/application/AddCredit/CustomerAddCredit';

// Define validation schemas
const customerAddCreditSchema = z.object({
  customerId: z.string().uuid(),
  creditToAdd: z.number(),
});

class PostCustomerAddCreditController implements Controller {
  async run(req: Request, res: Response) {
    // 1. Validate data
    const { customerId, creditToAdd } = req.body;
    const validation = customerAddCreditSchema.safeParse({ customerId, creditToAdd });
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
    const customerAddCredit = new CustomerAddCredit(customerRepository);
    customerAddCredit.run({
      customerId,
      creditToAdd,
    });
    // 4. Return
    res.status(httpStatus.OK).send({});
  }
}

export const register = (router: Router) => {
  const controller = new PostCustomerAddCreditController();
  router.post('/v1/customer/add-credit', (req: Request, res: Response) => controller.run(req, res));
};
