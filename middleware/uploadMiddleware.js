import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

// Custom Cloudinary storage engine using upload_stream for zero timeout and max reliability
class CloudinaryUploadStreamStorage {
  constructor(options = {}) {
    this.folder = options.folder || 'interior-design-studio';
  }

  _handleFile(req, file, cb) {
    if (!isCloudinaryConfigured) {
      return cb(new Error('Cloudinary is not configured. Please verify Cloudinary credentials in .env'));
    }

    const uploadOptions = {
      folder: this.folder,
      resource_type: 'image',
      transformation: [{ width: 1920, quality: 'auto:good', fetch_format: 'auto' }]
    };

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('[Cloudinary Upload Stream Error]:', error);
        return cb(error);
      }
      cb(null, {
        path: result.secure_url,
        url: result.secure_url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes,
        filename: result.public_id
      });
    });

    file.stream.pipe(uploadStream);
  }

  _removeFile(req, file, cb) {
    if (file && file.public_id) {
      cloudinary.uploader.destroy(file.public_id, () => {
        cb(null);
      });
    } else {
      cb(null);
    }
  }
}

// Ensure uploads folder exists as local fallback if Cloudinary is not configured
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    // Ignore folder creation errors
  }
}

let storage;

if (isCloudinaryConfigured) {
  storage = new CloudinaryUploadStreamStorage({
    folder: 'interior-design-studio'
  });
  console.log('[Upload Middleware] Using Cloudinary Storage for all file uploads.');
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  console.warn('[Upload Middleware] Cloudinary not configured. Falling back to local disk storage.');
}

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, avif) are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

export const projectUpload = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]);

export const singleUpload = (fieldName = 'image') => upload.single(fieldName);

export const getUploadedFileUrl = (file, req) => {
  if (!file) return null;
  // If uploaded to Cloudinary
  if (file.secure_url) {
    return file.secure_url;
  }
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
    return file.path;
  }
  if (file.url && (file.url.startsWith('http://') || file.url.startsWith('https://'))) {
    return file.url;
  }
  if (file.filename && (file.filename.startsWith('http://') || file.filename.startsWith('https://'))) {
    return file.filename;
  }
  // Local disk fallback
  const host = req ? (req.protocol + '://' + req.get('host')) : '';
  return `${host}/uploads/${file.filename}`;
};

