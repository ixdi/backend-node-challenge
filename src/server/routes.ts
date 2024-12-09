import bodyParser from 'body-parser';
import compress from 'compression';
import express from 'express';
import helmet from 'helmet';
import serverless from 'serverless-http';
import { StatusGetController } from '@/controllers/status';
import { PostCustomerDeleteController } from '@/controllers/customers/commands/delete';
import { PostCustomerCreateController } from '@/controllers/customers/commands/create';
import { PostCustomerUpdateController } from '@/controllers/customers/commands/update';
import { PostCustomerAddCreditController } from '@/controllers/customers/commands/addCredit';
import { GetCustomerSearchByIdController } from '@/controllers/customers/queries/searchById';
import { GetCustomerSearchByCreditController } from '@/controllers/customers/queries/searchByCredit';
import { getContainer } from '@/dependency-injection';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(compress());

app.get('/status', async (req, res) => {
  const container = await getContainer();
  const controllerStatus: StatusGetController = container.get('Shop.controllers.StatusGetController');
  return await controllerStatus.run(req, res);
})

app.post('/v1/customer/create', async (req, res) => {
  const container = await getContainer();
  const controllerCreate: PostCustomerCreateController = container.get('Shop.controllers.PostCustomerCreateController');
  return await controllerCreate.run(req, res)
});

app.post('/v1/customer/delete', async (req, res) => {
  const container = await getContainer();
  const controllerDelete: PostCustomerDeleteController = container.get('Shop.controllers.PostCustomerDeleteController');
  return await controllerDelete.run(req, res);
});

app.post('/v1/customer/update', async (req, res) => {
  const container = await getContainer();
  const controllerUpdate: PostCustomerUpdateController = container.get('Shop.controllers.PostCustomerUpdateController');
  return await controllerUpdate.run(req, res)
});

app.post('/v1/customer/update', async (req, res) => {
  const container = await getContainer();
  const controllerAddCredit: PostCustomerAddCreditController = container.get('Shop.controllers.PostCustomerAddCreditController');
  return await controllerAddCredit.run(req, res)
});

app.get('/v1/customer/search', async (req, res) => {
  const container = await getContainer();
  const controllerSearchById: GetCustomerSearchByIdController = container.get('Shop.controllers.GetCustomerSearchByIdController');
  return await controllerSearchById.run(req, res);
});

app.get('/v1/customer/search-by-credit', async (req, res) => {
  const container = await getContainer();
  const controllerSearchByCredit: GetCustomerSearchByCreditController = container.get('Shop.controllers.GetCustomerSearchByCreditController');
  return await controllerSearchByCredit.run(req, res)
});

exports.handler = serverless(app)
