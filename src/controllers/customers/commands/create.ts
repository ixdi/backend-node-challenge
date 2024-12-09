import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from '../../Controller';
import { z } from 'zod';
import { CustomerCreate } from '@/contexts/Shop/customers/application/Create/CustomerCreate';
import { CustomerId } from '@/contexts/Shop/Shared/domain/CustomerId';
import { getContainer } from '@/dependency-injection';
import { MongoCustomerRepository } from '@/contexts/Shop/customers/infrastructure/persistence/MongoCustomerRepository';
import { MongoClientFactory } from '@/contexts/Shared/infrastructure/persistence/mongo/MongoClient';

// Define validation schemas
const customerCreateSchema = z.object({
  name: z.string(),
  credit: z.number().optional(),
});

export class PostCustomerCreateController implements Controller {
  constructor(private customerCreate: CustomerCreate) { }

  async run(req: Request, res: Response) {
    console.log(req.body);
    console.log(process.env.MONGODB_URI);
    // 1. Validate data
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
    // 4. Return customerId
    res.status(httpStatus.OK).json({
      customerId,
    });
  }
}

export const register = async (router: Router) => {
  console.log('Registering customer create controller');
  const mongoClient = await MongoClientFactory.createClient('motorbike', { url: process.env.MONGODB_URI || '' });
  const customerRepository = new MongoCustomerRepository(mongoClient);
  const customerCreate = new CustomerCreate(customerRepository);
  const controllerCreate: PostCustomerCreateController = new PostCustomerCreateController(customerCreate);
  router.post('/v1/customer/create', (req: Request, res: Response) => controllerCreate.run(req, res));
};
