import { Server } from './server';

export class BackendApp {
  server?: Server;

  async start(port?: string) {
    const _port = port || process.env.PORT || '5000';
    this.server = new Server(_port);
    return await this.server.listen();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }

  async stop() {
    return this.server?.stop();
  }

}
