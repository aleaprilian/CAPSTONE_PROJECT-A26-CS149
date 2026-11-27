import { Router } from 'express';
import { createProductController } from '../controllers/productController.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export function createProductRouter(repo) {
  const router = Router();
  const controller = createProductController(repo);

  router.get('/', asyncHandler(controller.listProducts));
  router.get('/:id', asyncHandler(controller.getProductById));
  router.post('/', asyncHandler(controller.createProduct));
  router.put('/:id', asyncHandler(controller.updateProduct));
  router.patch('/:id', asyncHandler(controller.updateProduct));
  router.delete('/:id', asyncHandler(controller.deleteProduct));

  return router;
}
