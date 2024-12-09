import bodyParser from 'body-parser';
import compress from 'compression';
import express, { Router, Request, Response } from 'express';
import helmet from 'helmet';
import * as http from 'http';
import httpStatus from 'http-status';
import { registerRoutes } from '../controllers';
import { getContainer } from '@/dependency-injection';

export class Server {
  private app: express.Express;
  private port: string;
  private httpServer?: http.Server;

  constructor(port: string) {
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(helmet.xssFilter());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.frameguard({ action: 'deny' }));
    this.app.use(compress());
  }

  async listen(): Promise<void> {
    await getContainer().then(async () => {
      const router = Router();
      this.app.use(router);

      await registerRoutes(router);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      router.use((err: Error, req: Request, res: Response, next: () => void) => {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
      });
    }).then(() => {
      return new Promise(resolve => {
        this.httpServer = this.app.listen(this.port, () => {
          console.log(
            `Backend App is running at http://localhost:${this.port} in ${this.app.get('env')} mode`
          );
          console.log('  Press CTRL-C to stop\n');
          resolve(null);
        });
      });
    }).catch(error => {
      console.error('Error starting server: ', error);
    });
  }

  getHTTPServer() {
    return this.httpServer;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close(error => {
          if (error) {
            return reject(error);
          }
          console.log('Server Stopped');
          return resolve();
        });
      }

      return resolve();
    });
  }
}
