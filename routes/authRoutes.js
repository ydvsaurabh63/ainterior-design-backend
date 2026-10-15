import express from 'express';
import {
  authAdmin,
  getAdminProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getClientOverview,
  getAdminsList,
  forgotPassword,
  verifyOtp,
  resetPassword,
  impersonateUser
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth routes
router.post('/login', authAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Private profile
router.get('/me', protect, getAdminProfile);

// Superadmin direct switch/login into Admin Dashboard
router.post('/impersonate/:id', protect, authorize('superadmin'), impersonateUser);

// Client overview (accessible by Client, and previewable by Superadmin & Admin)
router.get('/client-overview', protect, authorize('client', 'superadmin', 'admin'), getClientOverview);

// User management (Superadmin, Admin & Client)
router.get('/admins-list', protect, authorize('superadmin', 'admin'), getAdminsList);
router.get('/users', protect, authorize('superadmin', 'admin', 'client'), getUsers);
router.post('/users', protect, authorize('superadmin', 'admin', 'client'), createUser);
router.put('/users/:id', protect, authorize('superadmin', 'admin', 'client'), updateUser);
router.delete('/users/:id', protect, authorize('superadmin', 'admin', 'client'), deleteUser);

export default router;
