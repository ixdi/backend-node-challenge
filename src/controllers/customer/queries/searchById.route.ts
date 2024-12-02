import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { MongoClientFactory } from '@/contexts/Shared/infrastructure/persistence/mongo/MongoClient';
import { MongoCustomerRepository } from '@/contexts/Shop/customers/infrastructure/persistence/MongoCustomerRepository';
import { z } from 'zod';
import { CustomerSearchById } from '@/contexts/Shop/customers/application/SearchById/CustomerSearchById';

// Define validation schemas
const customerSearchByIdSchema = z.object({
  customerId: z.string().uuid(),
});

class GetCustomerSearchByIdController implements Controller {
  async run(req: Request, res: Response) {
    // 1. Validate data
    const customerId = req.body.customerId;
    const validation = customerSearchByIdSchema.safeParse({ customerId });
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
    const customerSearchById = new CustomerSearchById(customerRepository);
    const customerPrimitives = customerSearchById.run({
      customerId,
    });
    // 4. Return
    res.status(httpStatus.OK).send({
      customer: customerPrimitives,
    });
  }
}

export const register = (router: Router) => {
  const controller = new GetCustomerSearchByIdController();
  router.get('/v1/customer/search', (req: Request, res: Response) => controller.run(req, res));
};
