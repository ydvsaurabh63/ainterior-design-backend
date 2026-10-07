import express from 'express';
import {
  authAdmin,
  getAdminProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getClientOverview,
  getAdminsList
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public login
router.post('/login', authAdmin);

// Private profile
router.get('/me', protect, getAdminProfile);

// Client overview (accessible by Client, and previewable by Superadmin & Admin)
router.get('/client-overview', protect, authorize('client', 'superadmin', 'admin'), getClientOverview);

// User management (Superadmin, Admin & Client)
router.get('/admins-list', protect, authorize('superadmin', 'admin'), getAdminsList);
router.get('/users', protect, authorize('superadmin', 'admin', 'client'), getUsers);
router.post('/users', protect, authorize('superadmin', 'admin', 'client'), createUser);
router.put('/users/:id', protect, authorize('superadmin', 'admin', 'client'), updateUser);
router.delete('/users/:id', protect, authorize('superadmin', 'admin', 'client'), deleteUser);

export default router;
