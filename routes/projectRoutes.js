import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { projectUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, authorize('superadmin', 'admin'), projectUpload, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, authorize('superadmin', 'admin'), projectUpload, updateProject)
  .delete(protect, authorize('superadmin', 'admin'), deleteProject);

export default router;
