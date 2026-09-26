import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createEnquiry)
  .get(protect, authorize('superadmin', 'admin'), getEnquiries);

router.route('/:id')
  .put(protect, authorize('superadmin', 'admin'), updateEnquiryStatus)
  .delete(protect, authorize('superadmin', 'admin'), deleteEnquiry);

export default router;
