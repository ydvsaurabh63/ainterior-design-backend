import mongoose from 'mongoose';

const popularItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      default: 'Wayfair'
    },
    time: {
      type: String,
      default: 'Recently',
      trim: true
    },
    dimensions: {
      type: String,
      default: 'Standard Dimensions',
      trim: true
    },
    price: {
      type: String,
      default: '$0',
      trim: true
    },
    category: {
      type: String,
      default: 'Living Room',
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Product image is required']
    },
    roomImage: {
      type: String,
      default: '/sample-rooms/room-furnished-sofa.jpg'
    },
    productUrl: {
      type: String,
      default: '',
      trim: true
    },
    isPopular: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

// Virtual for auto-calculating display time if not provided
popularItemSchema.pre('save', function (next) {
  if (!this.time || this.time.trim() === '') {
    this.time = 'Recently';
  }
  next();
});

const PopularItem = mongoose.model('PopularItem', popularItemSchema);
export default PopularItem;
