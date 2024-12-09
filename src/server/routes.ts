import bodyParser from 'body-parser';
import compress from 'compression';
import express from 'express';
import helmet from 'helmet';
import serverless from 'serverless-http';
import { StatusGetController } from '../controllers/status.route';
import { PostCustomerCreateController } from '@/controllers/customers/commands/create.route';
import { PostCustomerDeleteController } from '@/controllers/customers/commands/delete.route';
import { PostCustomerUpdateController } from '@/controllers/customers/commands/update.route';
import { GetCustomerSearchByCreditController } from '@/controllers/customers/queries/searchByCredit.route';
import { GetCustomerSearchByIdController } from '@/controllers/customers/queries/searchById.route';
import { PostCustomerAddCreditController } from '@/controllers/customers/commands/addCredit.route';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(compress());

const controllerStatus = new StatusGetController();
app.get('/status', (req, res) => {
  return controllerStatus.run(req, res);
})

const controllerCreate = new PostCustomerCreateController();
app.post('/v1/customer/create', (req, res) => controllerCreate.run(req, res));

const controllerDelete = new PostCustomerDeleteController();
app.post('/v1/customer/delete', (req, res) => controllerDelete.run(req, res));

const controllerUpdate = new PostCustomerUpdateController();
app.post('/v1/customer/update', (req, res) => controllerUpdate.run(req, res));

const controllerAddCredit = new PostCustomerAddCreditController();
app.post('/v1/customer/add-credit', (req, res) => controllerAddCredit.run(req, res));

const controllerSearchById = new GetCustomerSearchByIdController();
app.post('/v1/customer/search', (req, res) => controllerSearchById.run(req, res));

const controllerSearchByCredit = new GetCustomerSearchByCreditController();
app.get('/v1/customer/search-by-credit', (req, res) => controllerSearchByCredit.run(req, res));

exports.handler = serverless(app)
