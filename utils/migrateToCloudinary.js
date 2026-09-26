import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import Project from '../models/Project.js';
import Testimonial from '../models/Testimonial.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();


const runMigration = async () => {
  if (!isCloudinaryConfigured) {
    console.error('Cloudinary is not configured. Check your .env file.');
    process.exit(1);
  }

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interior_design';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB...');

    if (!fs.existsSync(uploadsDir)) {
      console.log('No uploads directory found.');
      process.exit(0);
    }

    const files = fs.readdirSync(uploadsDir).filter((f) => f !== '.gitkeep' && !fs.statSync(path.join(uploadsDir, f)).isDirectory());
    console.log(`Found ${files.length} local files in backend/uploads to migrate to Cloudinary...`);

    const urlMapping = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(uploadsDir, file);
      console.log(`[${i + 1}/${files.length}] Uploading ${file} to Cloudinary...`);

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'interior-design-studio',
          use_filename: true,
          unique_filename: false,
          resource_type: 'auto'
        });

        urlMapping[file] = result.secure_url;
        console.log(`  -> Uploaded successfully: ${result.secure_url}`);
      } catch (uploadErr) {
        console.error(`  -> Failed to upload ${file}:`, uploadErr.message);
      }
    }

    console.log('\n--- Updating Database References ---');

    // 1. Update Projects
    const projects = await Project.find({});
    let updatedProjectsCount = 0;

    for (const project of projects) {
      let modified = false;

      // Check mainImage
      if (project.mainImage && (project.mainImage.includes('/uploads/') || !project.mainImage.startsWith('http'))) {
        for (const [localFile, cloudUrl] of Object.entries(urlMapping)) {
          if (project.mainImage.includes(localFile)) {
            project.mainImage = cloudUrl;
            modified = true;
            break;
          }
        }
      }

      // Check galleryImages
      if (Array.isArray(project.galleryImages)) {
        project.galleryImages = project.galleryImages.map((img) => {
          if (img && (img.includes('/uploads/') || !img.startsWith('http'))) {
            for (const [localFile, cloudUrl] of Object.entries(urlMapping)) {
              if (img.includes(localFile)) {
                modified = true;
                return cloudUrl;
              }
            }
          }
          return img;
        });
      }

      if (modified) {
        await project.save();
        updatedProjectsCount++;
        console.log(`Updated Project "${project.title}" to Cloudinary URLs.`);
      }
    }

    // 2. Update Testimonials
    const testimonials = await Testimonial.find({});
    let updatedTestimonialsCount = 0;

    for (const testimonial of testimonials) {
      if (testimonial.image && (testimonial.image.includes('/uploads/') || !testimonial.image.startsWith('http'))) {
        for (const [localFile, cloudUrl] of Object.entries(urlMapping)) {
          if (testimonial.image.includes(localFile)) {
            testimonial.image = cloudUrl;
            await testimonial.save();
            updatedTestimonialsCount++;
            console.log(`Updated Testimonial "${testimonial.name}" to Cloudinary URL.`);
            break;
          }
        }
      }
    }

    console.log('\n=========================================');
    console.log(`Migration Complete!`);
    console.log(`- Uploaded Files to Cloudinary: ${Object.keys(urlMapping).length}`);
    console.log(`- Projects updated in DB: ${updatedProjectsCount}`);
    console.log(`- Testimonials updated in DB: ${updatedTestimonialsCount}`);
    console.log('=========================================');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
