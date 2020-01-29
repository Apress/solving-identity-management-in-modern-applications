import articlesRouter from './api/controllers/articles/router';
import userRouter from './api/controllers/user/router';

export default function routes(app) {
  app.use('/api/v1/articles', articlesRouter);
  app.use('/api/v1/user', userRouter);
}
