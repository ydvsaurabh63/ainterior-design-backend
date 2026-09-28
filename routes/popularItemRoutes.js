import express from 'express';
import {
  getPopularItems,
  getAllItemsAdmin,
  getPopularItemById,
  createPopularItem,
  updatePopularItem,
  deletePopularItem
} from '../controllers/popularItemController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { singleUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route for website showcase
router.get('/', getPopularItems);

// Protected admin routes for superadmin & admin
router.get('/admin', protect, authorize('superadmin', 'admin'), getAllItemsAdmin);

router.post(
  '/',
  protect,
  authorize('superadmin', 'admin'),
  singleUpload('image'),
  createPopularItem
);

router.get('/:id', getPopularItemById);

router.put(
  '/:id',
  protect,
  authorize('superadmin', 'admin'),
  singleUpload('image'),
  updatePopularItem
);

router.delete(
  '/:id',
  protect,
  authorize('superadmin', 'admin'),
  deletePopularItem
);

export default router;
