import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { singleUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, authorize('superadmin', 'admin'), singleUpload('image'), createTestimonial);

router.route('/:id')
  .put(protect, authorize('superadmin', 'admin'), singleUpload('image'), updateTestimonial)
  .delete(protect, authorize('superadmin', 'admin'), deleteTestimonial);

export default router;
