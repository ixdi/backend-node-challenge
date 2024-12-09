import bodyParser from 'body-parser';
import compress from 'compression';
import express from 'express';
import helmet from 'helmet';
import serverless from 'serverless-http';
import container from '../dependency-injection';
import { StatusGetController } from '@/controllers/status';
import { PostCustomerDeleteController } from '@/controllers/customers/commands/delete';
import { PostCustomerCreateController } from '@/controllers/customers/commands/create';
import { PostCustomerUpdateController } from '@/controllers/customers/commands/update';
import { PostCustomerAddCreditController } from '@/controllers/customers/commands/addCredit';
import { GetCustomerSearchByIdController } from '@/controllers/customers/queries/searchById';
import { GetCustomerSearchByCreditController } from '@/controllers/customers/queries/searchByCredit';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(compress());

const controllerStatus: StatusGetController = container.get('Shop.controllers.StatusGetController');
app.get('/status', (req, res) => {
  return controllerStatus.run(req, res);
})

const controllerCreate: PostCustomerCreateController = container.get('Shop.controllers.PostCustomerCreateController');
app.post('/v1/customer/create', (req, res) => controllerCreate.run(req, res));

const controllerDelete: PostCustomerDeleteController = container.get('Shop.controllers.PostCustomerDeleteController');
app.post('/v1/customer/delete', (req, res) => controllerDelete.run(req, res));

const controllerUpdate: PostCustomerUpdateController = container.get('Shop.controllers.PostCustomerUpdateController');
app.post('/v1/customer/update', (req, res) => controllerUpdate.run(req, res));

const controllerAddCredit: PostCustomerAddCreditController = container.get('Shop.controllers.PostCustomerAddCreditController');
app.post('/v1/customer/update', (req, res) => controllerAddCredit.run(req, res));

const controllerSearchById: GetCustomerSearchByIdController = container.get('Shop.controllers.GetCustomerSearchByIdController');
app.get('/v1/customer/search', (req, res) => controllerSearchById.run(req, res));

const controllerSearchByCredit: GetCustomerSearchByCreditController = container.get('Shop.controllers.GetCustomerSearchByCreditController');
app.get('/v1/customer/search-by-credit', (req, res) => controllerSearchByCredit.run(req, res));

exports.handler = serverless(app)
