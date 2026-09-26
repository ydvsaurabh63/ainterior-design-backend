import express from 'express';
import { redesignRoom } from '../controllers/interiorController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Middleware that accepts any uploaded image file field without Unexpected Field errors
export const uploadRoomImage = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      // Find the first uploaded file from fields like 'image', 'roomImage', etc.
      req.file = req.files.find(f => ['image', 'roomImage', 'file', 'photo'].includes(f.fieldname)) || req.files[0];
    }
    next();
  });
};

/**
 * POST / & POST /redesign & POST /redesign-room
 */
router.post('/', uploadRoomImage, redesignRoom);
router.post('/redesign', uploadRoomImage, redesignRoom);
router.post('/redesign-room', uploadRoomImage, redesignRoom);

export default router;
