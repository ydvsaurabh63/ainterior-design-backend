import mongoose from 'mongoose';

const roomDesignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Design title is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['bedroom', 'living-room', 'kitchen', 'wall-paint-colors'],
        message: '{VALUE} is not a valid room design category'
      },
      lowercase: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Design image URL is required'],
      trim: true
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

// Index for high-performance category queries
roomDesignSchema.index({ category: 1, order: 1, createdAt: -1 });

const RoomDesign = mongoose.model('RoomDesign', roomDesignSchema);

export default RoomDesign;
