import pino from 'pino';
import env from './env';

const l = pino({
  name: env('APP_ID'),
  level: env('LOG_LEVEL'),
});

export default l;
