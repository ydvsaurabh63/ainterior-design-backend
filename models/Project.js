import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      default: 'living-room',
      trim: true
    },
    clientCategory: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      type: String,
      default: 'Studio Project',
      trim: true
    },
    area: {
      type: String,
      default: 'Standard Area',
      trim: true
    },
    style: {
      type: String,
      default: 'Modern Interior',
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      default: ''
    },
    materials: {
      type: [String],
      default: []
    },
    mainImage: {
      type: String,
      required: [true, 'Main image is required']
    },
    galleryImages: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
