import express from 'express';
import {
  getCatalogItems,
  getCatalogItemById,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem
} from '../controllers/catalogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public catalog routes
router.get('/', getCatalogItems);
router.get('/:id', getCatalogItemById);

// Protected Admin / Superadmin catalog routes
router.post(
  '/',
  protect,
  authorize('superadmin', 'admin'),
  upload.single('image'),
  createCatalogItem
);

router.put(
  '/:id',
  protect,
  authorize('superadmin', 'admin'),
  upload.single('image'),
  updateCatalogItem
);

router.delete(
  '/:id',
  protect,
  authorize('superadmin', 'admin'),
  deleteCatalogItem
);

export default router;
