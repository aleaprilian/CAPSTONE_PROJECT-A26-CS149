import { Router } from 'express';
import { createCategoryController } from '../controllers/categoryController.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export function createCategoryRouter(repo) {
  const router = Router();
  const controller = createCategoryController(repo);

  router.get('/', asyncHandler(controller.listCategories));

  return router;
}
