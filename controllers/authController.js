import Admin from '../models/Admin.js';
import Enquiry from '../models/Enquiry.js';
import Project from '../models/Project.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user (Superadmin, Admin, Client) & get token
// @route   POST /api/auth/login
// @access  Public
export const authAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await Admin.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'inactive') {
        return res.status(403).json({
          message: 'Your account is deactivated. Please contact the administrator.'
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'admin',
        status: user.status || 'active',
        phone: user.phone || '',
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getAdminProfile = async (req, res) => {
  try {
    const user = await Admin.findById(req.admin._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Superadmin sees all, Admin sees clients only)
// @route   GET /api/auth/users
// @access  Private (Superadmin, Admin)
export const getUsers = async (req, res) => {
  try {
    const currentRole = req.admin.role || 'admin';
    const { role, search } = req.query;

    let query = {};

    // Role filtering security
    if (currentRole === 'admin') {
      // Admin is only allowed to see client accounts
      query.role = 'client';
    } else if (role && role !== 'all') {
      query.role = role;
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const users = await Admin.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new user (Admin can only create Client; Superadmin can create any)
// @route   POST /api/auth/users
// @access  Private (Superadmin, Admin)
export const createUser = async (req, res) => {
  try {
    const currentRole = req.admin.role || 'admin';
    const { name, email, password, role = 'client', phone = '' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Role permission check
    let targetRole = role;
    if (currentRole === 'admin') {
      targetRole = 'client'; // Force client role for standard admin
    } else if (!['superadmin', 'admin', 'client'].includes(targetRole)) {
      targetRole = 'client';
    }

    // Check if email already registered
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const newUser = new Admin({
      name,
      email: email.toLowerCase(),
      password,
      role: targetRole,
      status: 'active',
      phone
    });

    await newUser.save();

    const created = await Admin.findById(newUser._id).select('-password');
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user details & status
// @route   PUT /api/auth/users/:id
// @access  Private (Superadmin, Admin)
export const updateUser = async (req, res) => {
  try {
    const currentRole = req.admin.role || 'admin';
    const targetUser = await Admin.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Permission check: Admin can only modify Clients
    if (currentRole === 'admin' && targetUser.role !== 'client') {
      return res.status(403).json({ message: 'Admins can only manage Client accounts' });
    }

    const { name, email, role, status, phone, password } = req.body;

    // Guard: Prevent demoting/deactivating oneself if last superadmin
    if (targetUser._id.toString() === req.admin._id.toString()) {
      if (status === 'inactive') {
        return res.status(400).json({ message: 'You cannot deactivate your own account' });
      }
      if (role && role !== targetUser.role) {
        return res.status(400).json({ message: 'You cannot change your own role' });
      }
    }

    if (name) targetUser.name = name;
    if (phone !== undefined) targetUser.phone = phone;

    if (email && email.toLowerCase() !== targetUser.email) {
      const emailTaken = await Admin.findOne({
        email: email.toLowerCase(),
        _id: { $ne: targetUser._id }
      });
      if (emailTaken) {
        return res.status(400).json({ message: 'Email is already used by another account' });
      }
      targetUser.email = email.toLowerCase();
    }

    // Role assignment logic
    if (role && currentRole === 'superadmin') {
      if (['superadmin', 'admin', 'client'].includes(role)) {
        targetUser.role = role;
      }
    }

    if (status && ['active', 'inactive'].includes(status)) {
      targetUser.status = status;
    }

    if (password && password.trim().length >= 6) {
      targetUser.password = password.trim();
    }

    await targetUser.save();

    const updated = await Admin.findById(targetUser._id).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private (Superadmin only)
export const deleteUser = async (req, res) => {
  try {
    const targetUser = await Admin.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser._id.toString() === req.admin._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    if (targetUser.role === 'superadmin') {
      const superadminCount = await Admin.countDocuments({ role: 'superadmin' });
      if (superadminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the sole Superadmin' });
      }
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Client Overview (inquiries and portfolio preview for logged in client)
// @route   GET /api/auth/client-overview
// @access  Private (Client)
export const getClientOverview = async (req, res) => {
  try {
    const clientEmail = req.admin.email.toLowerCase();

    // Fetch client inquiries if any submitted
    const enquiries = await Enquiry.find({ email: clientEmail }).sort({ createdAt: -1 });

    // Fetch projects count & sample designs
    const totalProjects = await Project.countDocuments();
    const featuredProjects = await Project.find({ featured: true }).limit(4);

    res.json({
      client: {
        _id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        phone: req.admin.phone,
        role: req.admin.role
      },
      enquiries,
      stats: {
        totalEnquiries: enquiries.length,
        studioProjects: totalProjects
      },
      featuredProjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
