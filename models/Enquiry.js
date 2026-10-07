import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    city: {
      type: String,
      default: 'General',
      trim: true
    },
    propertyType: {
      type: String,
      default: 'General'
    },
    budget: {
      type: String,
      default: 'Flexible'
    },
    category: {
      type: String,
      default: '',
      trim: true
    },
    clientCategory: {
      type: String,
      default: '',
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required']
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New'
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    }
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
