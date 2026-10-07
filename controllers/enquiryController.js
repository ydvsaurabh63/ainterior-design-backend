import Enquiry from '../models/Enquiry.js';
import Admin from '../models/Admin.js';

// @desc    Create new enquiry / consultation booking (From Website Visitors)
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      city = 'General',
      propertyType = 'General',
      budget = 'Flexible',
      message,
      category = '',
      clientCategory = '',
      clientId = null
    } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, phone, email, and message.' });
    }

    const finalCategory = (category || clientCategory || '').trim();
    let linkedClientId = null;
    let linkedAdminId = null;

    if (clientId) {
      const client = await Admin.findById(clientId);
      if (client) {
        linkedClientId = client._id;
        linkedAdminId = client.parentAdminId || client.createdById || null;
      }
    } else if (finalCategory && finalCategory !== 'general-consultation') {
      // Auto-route enquiry to an active client managing this category
      const safeRegex = new RegExp(finalCategory.replace(/[-_]/g, '[-_ ]?'), 'i');
      const matchedClient = await Admin.findOne({
        role: 'client',
        status: 'active',
        $or: [
          { categories: finalCategory },
          { assignedCategory: finalCategory },
          { categories: safeRegex },
          { assignedCategory: safeRegex }
        ]
      });
      if (matchedClient) {
        linkedClientId = matchedClient._id;
        linkedAdminId = matchedClient.parentAdminId || matchedClient.createdById || null;
      }
    }

    const enquiry = new Enquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      city: (city || 'General').trim(),
      propertyType: propertyType || 'General',
      budget: budget || 'Flexible',
      category: finalCategory,
      clientCategory: finalCategory,
      message: message.trim(),
      status: 'New',
      clientId: linkedClientId,
      adminId: linkedAdminId
    });

    const savedEnquiry = await enquiry.save();
    res.status(201).json({
      message: 'Enquiry received successfully. Our team will contact you shortly.',
      enquiry: savedEnquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all enquiries (Superadmin sees all, Admin sees their clients' enquiries, Client sees assigned enquiries)
// @route   GET /api/enquiries
// @access  Private (Superadmin, Admin, Client)
export const getEnquiries = async (req, res) => {
  try {
    const currentRole = req.admin?.role || 'admin';
    const { status, search, clientId, category } = req.query;
    let filter = {};

    // 1. Role-based scoping
    if (currentRole === 'superadmin') {
      if (clientId && clientId !== 'all') {
        filter.clientId = clientId;
      }
    } else if (currentRole === 'admin') {
      // Find all clients created by or assigned to this admin
      const myClients = await Admin.find({
        $or: [{ parentAdminId: req.admin._id }, { createdById: req.admin._id }]
      }).select('_id');
      const clientIds = myClients.map((c) => c._id);

      if (clientId && clientId !== 'all') {
        filter.clientId = clientId;
      } else {
        filter.$or = [{ adminId: req.admin._id }, { clientId: { $in: clientIds } }];
      }
    } else if (currentRole === 'client') {
      const clientCats = Array.isArray(req.admin.categories) && req.admin.categories.length > 0
        ? req.admin.categories
        : (req.admin.assignedCategory ? [req.admin.assignedCategory] : []);

      const clientConditions = [
        { clientId: req.admin._id },
        { email: req.admin.email?.toLowerCase() }
      ];

      if (clientCats.length > 0) {
        clientConditions.push({ category: { $in: clientCats } });
        clientConditions.push({ clientCategory: { $in: clientCats } });
      }

      filter.$or = clientConditions;
    }

    // Category filter
    if (category && category !== 'all') {
      const catCond = {
        $or: [{ category }, { clientCategory: category }]
      };
      if (filter.$and) {
        filter.$and.push(catCond);
      } else if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, catCond];
        delete filter.$or;
      } else {
        filter.$or = [{ category }, { clientCategory: category }];
      }
    }

    // 2. Status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // 3. Search filter
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      const searchConditions = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
        { propertyType: searchRegex }
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const enquiries = await Enquiry.find(filter)
      .populate('clientId', 'name email phone companyName')
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enquiry status or assign to Client
// @route   PUT /api/enquiries/:id
// @access  Private (Superadmin, Admin, Client)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status, clientId } = req.body;
    const currentRole = req.admin?.role || 'admin';

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    if (status) {
      if (!['New', 'Contacted', 'Closed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      enquiry.status = status;
    }

    // Assign / reassign to Client (Superadmin & Admin only)
    if (clientId !== undefined && (currentRole === 'superadmin' || currentRole === 'admin')) {
      if (clientId === '' || clientId === null) {
        enquiry.clientId = null;
        enquiry.adminId = null;
      } else {
        const client = await Admin.findById(clientId);
        if (client) {
          enquiry.clientId = client._id;
          enquiry.adminId = client.parentAdminId || client.createdById || null;
        }
      }
    }

    const updatedEnquiry = await enquiry.save();
    const populated = await Enquiry.findById(updatedEnquiry._id)
      .populate('clientId', 'name email phone companyName')
      .populate('adminId', 'name email');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private (Superadmin, Admin)
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      await enquiry.deleteOne();
      res.json({ message: 'Enquiry deleted successfully' });
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
