import mongoose from 'mongoose';

const catalogItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Catalog item name is required'],
      trim: true
    },
    clientCategory: {
      type: String,
      required: [true, 'Client category is required'],
      trim: true
    },
    objectCategory: {
      type: String,
      required: [true, 'Object category is required'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Catalog image URL is required']
    },
    stagedRoomImage: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    brand: {
      type: String,
      trim: true,
      default: 'AURA Collection'
    },
    price: {
      type: String,
      trim: true,
      default: ''
    },
    section: {
      type: String,
      default: 'catalog',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching & category filtering
catalogItemSchema.index({ clientCategory: 1, objectCategory: 1 });
catalogItemSchema.index({ name: 'text', description: 'text', brand: 'text' });

const CatalogItem = mongoose.models.CatalogItem || mongoose.model('CatalogItem', catalogItemSchema);

export default CatalogItem;
