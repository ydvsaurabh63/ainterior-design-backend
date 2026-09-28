import express from 'express';
import {
  getRoomDesigns,
  getRoomDesignById,
  createRoomDesign,
  updateRoomDesign,
  deleteRoomDesign
} from '../controllers/roomDesignController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route to fetch designs (optionally filtered by ?category=bedroom)
router.get('/', getRoomDesigns);
router.get('/:id', getRoomDesignById);

// Protected routes for Admin Panel
router.post(
  '/',
  protect,
  authorize('superadmin', 'admin'),
  upload.single('image'),
  createRoomDesign
);

router.put(
  '/:id',
  protect,
  authorize('superadmin', 'admin'),
  upload.single('image'),
  updateRoomDesign
);

router.delete(
  '/:id',
  protect,
  authorize('superadmin', 'admin'),
  deleteRoomDesign
);

export default router;
