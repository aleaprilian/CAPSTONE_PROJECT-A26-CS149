import cors from 'cors';
import express, { Router } from 'express';
import { createHealthController } from './controllers/healthController.js';
import { asyncHandler, errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { createCategoryRouter } from './routes/categoryRoutes.js';
import { createProductRouter } from './routes/productRoutes.js';

/**
 * Membangun instance Express dengan repositori terinjeksi agar mudah diuji.
 */
export function createApp(repo, { corsOrigins = ['http://localhost:5173'] } = {}) {
  const app = express();
  const healthController = createHealthController(repo);
  const apiRouter = Router();

  app.use(
    cors({
      origin: corsOrigins.includes('*') ? true : corsOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  apiRouter.get('/health', asyncHandler(healthController.getHealth));
  apiRouter.use('/categories', createCategoryRouter(repo));
  apiRouter.use('/products', createProductRouter(repo));

  app.use('/api', apiRouter);
  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
