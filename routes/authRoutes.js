import express from 'express';
import {
  authAdmin,
  getAdminProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getClientOverview
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public login
router.post('/login', authAdmin);

// Private profile
router.get('/me', protect, getAdminProfile);

// Client overview
router.get('/client-overview', protect, authorize('client'), getClientOverview);

// User management (Superadmin & Admin)
router.get('/users', protect, authorize('superadmin', 'admin'), getUsers);
router.post('/users', protect, authorize('superadmin', 'admin'), createUser);
router.put('/users/:id', protect, authorize('superadmin', 'admin'), updateUser);
router.delete('/users/:id', protect, authorize('superadmin'), deleteUser);

export default router;
