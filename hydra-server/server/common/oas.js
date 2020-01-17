import Express from 'express';
import * as path from 'path';
import errorHandler from '../api/middlewares/error.handler';
import { OpenApiValidator } from 'express-openapi-validator';
import env from './env';


export default function oas(app, routes) {
  const apiSpec = path.join(__dirname, 'api.yml');
  const validateResponses =env('OPENAPI_ENABLE_RESPONSE_VALIDATION').toUpperCase() === 'true';
  const openApiSpec = env('OPENAPI_SPEC', '/spec');
  
  return new OpenApiValidator({
    apiSpec,
    validateResponses,
  })
    .install(app)
    .then(() => {
      // app.use(openApiSpec, Express.static(apiSpec));
      routes(app);
      app.use(errorHandler);
    });
}
