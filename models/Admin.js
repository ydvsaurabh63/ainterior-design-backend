import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Studio Administrator'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'client', 'user'],
      default: 'admin'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    phone: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: ''
    },
    categories: {
      type: [String],
      default: []
    },
    assignedCategory: {
      type: String,
      default: ''
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    },
    parentAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    }
  },
  { timestamps: true }
);

adminSchema.index({ categories: 1 });
adminSchema.index({ assignedCategory: 1 });

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
