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
      required: [true, 'Category is required'],
      enum: {
        values: ['living-room', 'bedroom', 'kitchen', 'full-home', 'furniture'],
        message: '{VALUE} is not a valid category'
      }
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Area/Size is required'],
      trim: true
    },
    style: {
      type: String,
      required: [true, 'Design style is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
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
