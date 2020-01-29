import 'dotenv/config';
import Server from './common/Server';
import routes from './routes';

export default new Server().router(routes).listen(process.env.PORT);
