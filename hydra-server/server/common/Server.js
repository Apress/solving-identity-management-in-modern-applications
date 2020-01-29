import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import cookieParser from 'cookie-parser';

// import oas from './oas';

import l from './logger';
import env from './env';
import corsMiddleware from '../api/middlewares/cors.middleware';
import errorHandler from '../api/middlewares/error.handler';

const app = new Express();
// const exit = process.exit;

export default class Server {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}/client`);
    app.use(bodyParser.json({ limit: env('REQUEST_LIMIT', '100kb') }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: env('REQUEST_LIMIT', '100kb'),
      })
    );
    app.use(bodyParser.text({ limit: env('REQUEST_LIMIT', '100kb') }));
    app.use(cookieParser(env('SESSION_SECRET')));
    app.use(Express.static(`${root}/public`));
  }

  router(routes) {
    this.routes = routes;
    return this;
  }

  async listen(port = env('PORT')) {
    const welcome = p => () =>
      l.info(
        `up and running in ${env('NODE_ENV',
          'development')} @: ${os.hostname()} on port: ${p}}`
      );
      
    try {
      app.use(corsMiddleware);
      // await oas(app, this.routes)
      this.routes(app);
      http.createServer(app).listen(port, welcome(port));
      app.use(errorHandler);
    } catch (e) {
      l.error('Error starting the server', e);
    }
    
    return app;
  }
}
