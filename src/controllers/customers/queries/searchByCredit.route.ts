import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { MongoClientFactory } from '@/contexts/Shared/infrastructure/persistence/mongo/MongoClient';
import { MongoCustomerRepository } from '@/contexts/Shop/customers/infrastructure/persistence/MongoCustomerRepository';
import { z } from 'zod';
import { CustomerSearchByCredit } from '@/contexts/Shop/customers/application/SearchByCredit/CustomerSearchByCredit';

// Define validation schemas
const customerSearchByCreditSchema = z.object({
});

export class GetCustomerSearchByCreditController implements Controller {
  async run(req: Request, res: Response) {
    // 1. Validate data
    const body = req.body;
    const validation = customerSearchByCreditSchema.safeParse(body);
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
    const customerSearchByCredit = new CustomerSearchByCredit(customerRepository);
    const customersPrimitives = await customerSearchByCredit.run();
    // 4. Return
    res.status(httpStatus.OK).json({
      customers: customersPrimitives,
    });
  }
}

export const register = (router: Router) => {
  const controller = new GetCustomerSearchByCreditController();
  router.get('/v1/customer/search-by-credit', (req: Request, res: Response) => controller.run(req, res));
};
