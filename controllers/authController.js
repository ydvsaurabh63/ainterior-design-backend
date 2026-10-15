import crypto from 'crypto';
import Admin from '../models/Admin.js';
import Enquiry from '../models/Enquiry.js';
import Project from '../models/Project.js';
import CatalogItem from '../models/CatalogItem.js';
import generateToken from '../utils/generateToken.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

// @desc    Auth user (Superadmin, Admin, Client) & get token
// @route   POST /api/auth/login
// @access  Public
export const authAdmin = async (req, res) => {
  try {
    const { email, password, portalRole } = req.body;

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

      // Check portal restrictions if portalRole is specified
      if (portalRole) {
        if (portalRole === 'superadmin' && user.role !== 'superadmin') {
          return res.status(403).json({
            message: 'Access Denied: Only Superadmin can log in from the Superadmin portal.'
          });
        }
        if (portalRole === 'admin' && user.role !== 'admin' && user.role !== 'superadmin') {
          return res.status(403).json({
            message: 'Access Denied: This portal is for Administrators only. Clients should use the Client Portal (/client/login).'
          });
        }
        if (portalRole === 'client' && user.role !== 'client') {
          return res.status(403).json({
            message: 'Access Denied: This portal is for Clients only. Administrators should use the Admin Portal (/admin/login).'
          });
        }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'admin',
        status: user.status || 'active',
        phone: user.phone || '',
        companyName: user.companyName || '',
        categories: user.categories || [],
        assignedCategory: user.assignedCategory || '',
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

// @desc    Get all users (Superadmin sees all, Admin sees their clients, Client sees their team)
// @route   GET /api/auth/users
// @access  Private (Superadmin, Admin, Client)
export const getUsers = async (req, res) => {
  try {
    const currentRole = req.admin.role || 'admin';
    const { role, search, adminId, category } = req.query;

    let query = {};

    // Role filtering security
    if (currentRole === 'superadmin') {
      if (role && role !== 'all') {
        query.role = role;
      }
      // Superadmin can filter clients by a specific parent admin
      if (adminId && adminId !== 'all') {
        query.$or = [{ parentAdminId: adminId }, { createdById: adminId }];
      }
    } else if (currentRole === 'admin') {
      // Admin is only allowed to see their own clients or users
      query.role = { $in: ['client', 'user'] };
      if (role && ['client', 'user'].includes(role)) {
        query.role = role;
      }
      query.$or = [
        { parentAdminId: req.admin._id },
        { createdById: req.admin._id }
      ];
    } else if (currentRole === 'client') {
      // Client is allowed to see and manage their own category users
      query.role = 'user';
      const clientCats = Array.isArray(req.admin.categories) && req.admin.categories.length > 0
        ? req.admin.categories
        : (req.admin.assignedCategory ? [req.admin.assignedCategory] : []);

      const clientScopedConditions = [
        { parentAdminId: req.admin._id },
        { createdById: req.admin._id }
      ];
      if (clientCats.length > 0) {
        clientScopedConditions.push({ categories: { $in: clientCats } });
        clientScopedConditions.push({ assignedCategory: { $in: clientCats } });
      }
      query.$or = clientScopedConditions;
    } else {
      query.role = 'user';
      query.parentAdminId = req.admin._id;
    }

    // Dynamic Category filter
    if (category && category !== 'all') {
      const catCondition = {
        $or: [
          { categories: category },
          { assignedCategory: category }
        ]
      };
      if (query.$and) {
        query.$and.push(catCondition);
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, catCondition];
        delete query.$or;
      } else {
        query.$or = [{ categories: category }, { assignedCategory: category }];
      }
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      const searchConditions = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { companyName: searchRegex }
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    const users = await Admin.find(query)
      .select('-password')
      .populate('parentAdminId', 'name email role companyName')
      .populate('createdById', 'name email role')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get list of Admins (for dropdown assignment by Superadmin)
// @route   GET /api/auth/admins-list
// @access  Private (Superadmin)
export const getAdminsList = async (req, res) => {
  try {
    const admins = await Admin.find({ role: { $in: ['admin', 'superadmin'] } })
      .select('_id name email role companyName phone')
      .sort({ name: 1 });

    const adminsWithClientCounts = await Promise.all(
      admins.map(async (adm) => {
        const clientCount = await Admin.countDocuments({
          role: 'client',
          $or: [{ parentAdminId: adm._id }, { createdById: adm._id }]
        });
        return {
          ...adm.toObject(),
          clientCount
        };
      })
    );

    res.json(adminsWithClientCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new user (Superadmin can create Admin/Client/User; Admin can create Client/User; Client can create User)
// @route   POST /api/auth/users
// @access  Private (Superadmin, Admin, Client)
export const createUser = async (req, res) => {
  try {
    const currentRole = req.admin.role || 'admin';
    const {
      name,
      email,
      password,
      role = 'client',
      phone = '',
      companyName = '',
      parentAdminId,
      categories = [],
      assignedCategory = ''
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Normalize categories array (supports 1, 2, or multiple categories dynamically)
    let finalCategories = Array.isArray(categories)
      ? categories.filter((c) => typeof c === 'string' && c.trim() !== '').map((c) => c.trim())
      : [];
    if (assignedCategory && typeof assignedCategory === 'string' && assignedCategory.trim()) {
      const cleanAssigned = assignedCategory.trim();
      if (!finalCategories.includes(cleanAssigned)) {
        finalCategories.push(cleanAssigned);
      }
    }
    const finalAssignedCategory = finalCategories[0] || (typeof assignedCategory === 'string' ? assignedCategory.trim() : '');

    // Role permission check
    let targetRole = role;
    let assignedParentAdminId = null;

    if (currentRole === 'admin') {
      targetRole = role === 'user' ? 'user' : 'client'; // Force client or user for standard admin
      assignedParentAdminId = req.admin._id;
    } else if (currentRole === 'superadmin') {
      if (targetRole === 'superadmin') {
        return res.status(400).json({ message: 'Creating additional Superadmins is disabled for security' });
      }
      if (!['admin', 'client', 'user'].includes(targetRole)) {
        targetRole = 'client';
      }
      if (targetRole === 'client' && parentAdminId) {
        assignedParentAdminId = parentAdminId;
      }
    } else if (currentRole === 'client') {
      // Client is creating an end-user / customer account under their workspace
      targetRole = 'user';
      assignedParentAdminId = req.admin._id;
      // Inherit client categories if not explicitly set
      if (finalCategories.length === 0) {
        finalCategories = Array.isArray(req.admin.categories) && req.admin.categories.length > 0
          ? [...req.admin.categories]
          : (req.admin.assignedCategory ? [req.admin.assignedCategory] : []);
      }
    } else {
      return res.status(403).json({ message: 'Unauthorized to create accounts' });
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
      phone,
      companyName: companyName || '',
      categories: finalCategories,
      assignedCategory: finalAssignedCategory,
      createdById: req.admin._id,
      parentAdminId: assignedParentAdminId
    });

    await newUser.save();

    const created = await Admin.findById(newUser._id)
      .select('-password')
      .populate('parentAdminId', 'name email role companyName')
      .populate('createdById', 'name email role');
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user details & status
// @route   PUT /api/auth/users/:id
// @access  Private (Superadmin, Admin, Client)
export const updateUser = async (req, res) => {
  try {
    const currentRole = req.admin.role || 'admin';
    const targetUser = await Admin.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Permission check: Admin / Client scoping
    if (currentRole === 'admin') {
      const isSelf = targetUser._id.toString() === req.admin._id.toString();
      const isTheirClient =
        (targetUser.role === 'client' || targetUser.role === 'user') &&
        (targetUser.parentAdminId?.toString() === req.admin._id.toString() ||
          targetUser.createdById?.toString() === req.admin._id.toString());

      if (!isTheirClient && !isSelf) {
        return res.status(403).json({ message: 'Admins can only manage their own Client/User accounts' });
      }
    } else if (currentRole === 'client') {
      const isSelf = targetUser._id.toString() === req.admin._id.toString();
      const isTheirUser =
        targetUser.role === 'user' &&
        (targetUser.parentAdminId?.toString() === req.admin._id.toString() ||
          targetUser.createdById?.toString() === req.admin._id.toString());

      if (!isTheirUser && !isSelf) {
        return res.status(403).json({ message: 'Clients can only manage their own User accounts' });
      }
    }

    const {
      name,
      email,
      role,
      status,
      phone,
      companyName,
      parentAdminId,
      password,
      categories,
      assignedCategory
    } = req.body;

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
    if (companyName !== undefined) targetUser.companyName = companyName;

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

    // Role assignment logic (Superadmin only)
    if (role && currentRole === 'superadmin') {
      if (['superadmin', 'admin', 'client', 'user'].includes(role)) {
        targetUser.role = role;
      }
    }

    // Reassign parent admin (Superadmin only)
    if (currentRole === 'superadmin' && parentAdminId !== undefined) {
      targetUser.parentAdminId = parentAdminId || null;
    }

    // Update dynamic categories (Superadmin or Admin)
    if (categories !== undefined) {
      const normCats = Array.isArray(categories)
        ? categories.filter((c) => typeof c === 'string' && c.trim() !== '').map((c) => c.trim())
        : [];
      targetUser.categories = normCats;
      targetUser.assignedCategory = normCats[0] || '';
    } else if (assignedCategory !== undefined) {
      const cleanAssigned = typeof assignedCategory === 'string' ? assignedCategory.trim() : '';
      targetUser.assignedCategory = cleanAssigned;
      if (cleanAssigned && !targetUser.categories.includes(cleanAssigned)) {
        targetUser.categories.push(cleanAssigned);
      }
    }

    if (status && ['active', 'inactive'].includes(status)) {
      targetUser.status = status;
    }

    if (password && password.trim().length >= 6) {
      targetUser.password = password.trim();
    }

    await targetUser.save();

    const updated = await Admin.findById(targetUser._id)
      .select('-password')
      .populate('parentAdminId', 'name email role companyName')
      .populate('createdById', 'name email role');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private (Superadmin, Admin, Client)
export const deleteUser = async (req, res) => {
  try {
    const currentRole = req.admin.role || 'admin';
    const targetUser = await Admin.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser._id.toString() === req.admin._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Admin can delete their own client/user
    if (currentRole === 'admin') {
      const isTheirClient =
        (targetUser.role === 'client' || targetUser.role === 'user') &&
        (targetUser.parentAdminId?.toString() === req.admin._id.toString() ||
          targetUser.createdById?.toString() === req.admin._id.toString());

      if (!isTheirClient) {
        return res.status(403).json({ message: 'You can only delete your own Client/User accounts' });
      }
    } else if (currentRole === 'client') {
      const isTheirUser =
        targetUser.role === 'user' &&
        (targetUser.parentAdminId?.toString() === req.admin._id.toString() ||
          targetUser.createdById?.toString() === req.admin._id.toString());

      if (!isTheirUser) {
        return res.status(403).json({ message: 'Clients can only delete their own User accounts' });
      }
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

// @desc    Get Client Overview (inquiries, categories, users, catalog preview for logged in client)
// @route   GET /api/auth/client-overview
// @access  Private (Client, Superadmin, Admin)
export const getClientOverview = async (req, res) => {
  try {
    const isSuper = req.admin.role === 'superadmin';
    const isAdmin = req.admin.role === 'admin';
    const client = await Admin.findById(req.admin._id)
      .select('-password')
      .populate('parentAdminId', 'name email phone role companyName');

    if (!client) {
      return res.status(404).json({ message: 'Client account not found' });
    }

    const clientEmail = (req.admin.email || '').toLowerCase();
    let clientCats = Array.isArray(client.categories) && client.categories.length > 0
      ? client.categories
      : (client.assignedCategory ? [client.assignedCategory] : []);

    // If superadmin or admin previewing client portal, default to all sectors if none explicitly assigned
    if (clientCats.length === 0 && (isSuper || isAdmin)) {
      clientCats = [
        'modular-kitchen-wardrobe-companies',
        'furniture-manufacturers-dealers',
        'interior-design-companies-designers',
        'real-estate-developers-builders',
        'home-decor-tiles-flooring'
      ];
    }

    let enquiries = [];
    if (isSuper) {
      enquiries = await Enquiry.find().sort({ createdAt: -1 });
    } else {
      const enquiryConditions = [
        { email: clientEmail },
        { clientId: req.admin._id }
      ];

      if (clientCats.length > 0) {
        const catPatterns = clientCats.map((c) => c.split(/[-_]+/).filter(Boolean).join('.*'));
        const safeRegex = new RegExp(catPatterns.join('|'), 'i');
        enquiryConditions.push({ category: { $in: clientCats } });
        enquiryConditions.push({ clientCategory: { $in: clientCats } });
        enquiryConditions.push({ category: safeRegex });
        enquiryConditions.push({ clientCategory: safeRegex });
      }

      enquiries = await Enquiry.find({ $or: enquiryConditions }).sort({ createdAt: -1 });
    }

    // Fetch users created by or belonging to this client or their categories
    let myUsersCount = 0;
    if (isSuper) {
      myUsersCount = await Admin.countDocuments({ role: 'user' });
    } else {
      const userConditions = [
        { parentAdminId: req.admin._id },
        { createdById: req.admin._id }
      ];
      if (clientCats.length > 0) {
        userConditions.push({ categories: { $in: clientCats } });
        userConditions.push({ assignedCategory: { $in: clientCats } });
      }
      myUsersCount = await Admin.countDocuments({
        role: 'user',
        $or: userConditions
      });
    }

    // Catalog items count in client's categories
    let catalogCount = 0;
    if (clientCats.length > 0) {
      const catPatterns = clientCats.map((c) => c.split(/[-_]+/).filter(Boolean).join('.*'));
      const catRegex = new RegExp(catPatterns.join('|'), 'i');
      catalogCount = await CatalogItem.countDocuments({
        $or: [
          { clientCategory: { $in: clientCats } },
          { clientCategory: catRegex }
        ]
      });
    } else {
      catalogCount = await CatalogItem.countDocuments();
    }

    // Projects count & sample designs
    const totalProjects = await Project.countDocuments();
    const featuredProjects = await Project.find({ featured: true }).limit(4);

    res.json({
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        role: client.role,
        companyName: client.companyName || (isSuper ? 'Platform Master Studio' : ''),
        categories: clientCats,
        assignedCategory: clientCats[0] || '',
        assignedAdmin: client.parentAdminId || null
      },
      enquiries,
      stats: {
        totalEnquiries: enquiries.length,
        newEnquiries: enquiries.filter(e => (e.status || 'New').toLowerCase() === 'new').length,
        myUsersCount,
        catalogCount,
        studioProjects: totalProjects
      },
      featuredProjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - Send 6-Digit OTP to User's Email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide a valid registered email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await Admin.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'This account is deactivated. Please contact the administrator.' });
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving to DB
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Save hashed OTP with 10-minute validity
    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send email via nodemailer
    const emailResult = await sendOtpEmail({
      to: user.email,
      otp,
      userName: user.name
    });

    if (!emailResult.sent && emailResult.notConfigured) {
      console.log('----------------------------------------------------');
      console.log(`[OTP GENERATED FOR ${user.email}]: >>> ${otp} <<<`);
      console.log(`(Real email delivery requires EMAIL_USER & EMAIL_PASS in backend/.env)`);
      console.log('----------------------------------------------------');
      return res.json({
        success: true,
        message: `OTP generated for ${user.email}! (Add EMAIL_USER and EMAIL_PASS in backend/.env to deliver to real inbox)`
      });
    }

    if (!emailResult.sent && emailResult.error) {
      return res.status(500).json({
        message: `Failed to deliver email: ${emailResult.error}. Please check your EMAIL_USER and EMAIL_PASS in backend/.env`
      });
    }

    res.json({
      success: true,
      message: `A 6-digit verification code has been sent directly to ${user.email}. Please check your email inbox!`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify 6-Digit OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and 6-digit OTP code are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedOtp = crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');

    const user = await Admin.findOne({
      email: cleanEmail,
      resetPasswordOtp: hashedOtp,
      resetPasswordOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP code. Please request a new code.' });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully. You can now set your new password.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password with Verified OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedOtp = crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');

    const user = await Admin.findOne({
      email: cleanEmail,
      resetPasswordOtp: hashedOtp,
      resetPasswordOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP code. Please start over.' });
    }

    // Set new password (pre-save hook will hash it with bcrypt)
    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpire = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Superadmin direct login/switch into an admin's account
// @route   POST /api/auth/impersonate/:id
// @access  Private (Superadmin only)
export const impersonateUser = async (req, res) => {
  try {
    const targetUser = await Admin.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    if (targetUser.status === 'inactive') {
      return res.status(400).json({ message: 'Target user account is currently inactive' });
    }

    res.json({
      _id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role || 'admin',
      status: targetUser.status || 'active',
      phone: targetUser.phone || '',
      companyName: targetUser.companyName || '',
      categories: targetUser.categories || [],
      assignedCategory: targetUser.assignedCategory || '',
      token: generateToken(targetUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

