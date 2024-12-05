import bodyParser from 'body-parser';
import compress from 'compression';
import express from 'express';
import helmet from 'helmet';
import serverless from 'serverless-http';
import { StatusGetController } from '../controllers/status.route';
import { PostCustomerCreateController } from '@/controllers/customer/commands/create.route';

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

exports.handler = serverless(app)
