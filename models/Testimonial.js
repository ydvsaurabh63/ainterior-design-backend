import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true
    },
    role: {
      type: String,
      default: 'Homeowner',
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Image is required']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      default: 5
    },
    review: {
      type: String,
      required: [true, 'Review is required']
    }
  },
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
