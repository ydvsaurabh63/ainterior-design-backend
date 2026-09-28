import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import interiorRoutes from './routes/interiorRoutes.js';
import popularItemRoutes from './routes/popularItemRoutes.js';
import roomDesignRoutes from './routes/roomDesignRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

// Connect Database
connectDB();

const app = express();


// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads folder for image serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Interior Design Studio API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/interior', interiorRoutes);
app.use('/api/redesign-room', interiorRoutes);
app.use('/api/popular-items', popularItemRoutes);
app.use('/api/room-designs', roomDesignRoutes);
app.use('/api/catalog', catalogRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = (portToUse) => {
  const server = app.listen(portToUse, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${portToUse}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${portToUse} is busy. Trying fallback port ${Number(portToUse) + 1}...`);
      startServer(Number(portToUse) + 1);
    } else {
      console.error('Server error:', err.message);
    }
  });
};

startServer(PORT);
