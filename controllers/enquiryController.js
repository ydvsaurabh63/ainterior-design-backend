import Enquiry from '../models/Enquiry.js';

// @desc    Create new enquiry / consultation booking
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
      message
    } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, phone, email, and message.' });
    }

    const enquiry = new Enquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      city: (city || 'General').trim(),
      propertyType: propertyType || 'General',
      budget: budget || 'Flexible',
      message: message.trim(),
      status: 'New'
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

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
export const getEnquiries = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { propertyType: { $regex: search, $options: 'i' } }
      ];
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['New', 'Contacted', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      enquiry.status = status;
      const updatedEnquiry = await enquiry.save();
      res.json(updatedEnquiry);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
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
