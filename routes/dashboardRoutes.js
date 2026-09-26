import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('superadmin', 'admin'), getDashboardStats);

export default router;
