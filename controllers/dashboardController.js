import Project from '../models/Project.js';
import Enquiry from '../models/Enquiry.js';
import Testimonial from '../models/Testimonial.js';
import PopularItem from '../models/PopularItem.js';
import Admin from '../models/Admin.js';

// @desc    Get dashboard metrics & statistics (Dynamic by Role)
// @route   GET /api/dashboard/stats
// @access  Private (Superadmin, Admin, Client)
export const getDashboardStats = async (req, res) => {
  try {
    const currentRole = req.admin?.role || 'admin';
    let enquiryFilter = {};
    let clientFilter = { role: 'client' };

    if (currentRole === 'admin') {
      const myClients = await Admin.find({
        $or: [{ parentAdminId: req.admin._id }, { createdById: req.admin._id }]
      }).select('_id');
      const clientIds = myClients.map((c) => c._id);

      clientFilter = {
        role: 'client',
        $or: [{ parentAdminId: req.admin._id }, { createdById: req.admin._id }]
      };
      enquiryFilter = {
        $or: [{ adminId: req.admin._id }, { clientId: { $in: clientIds } }]
      };
    } else if (currentRole === 'client') {
      clientFilter = { _id: req.admin._id };
      enquiryFilter = {
        $or: [{ clientId: req.admin._id }, { email: req.admin.email?.toLowerCase() }]
      };
    }

    const [
      totalProjects,
      livingRoomProjects,
      bedroomProjects,
      kitchenProjects,
      fullHomeProjects,
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      closedEnquiries,
      totalTestimonials,
      totalPopularItems,
      totalClients,
      totalAdmins,
      totalSuperadmins,
      totalAccounts,
      recentEnquiries,
      recentProjects,
      popularItemsSample
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ category: 'living-room' }),
      Project.countDocuments({ category: 'bedroom' }),
      Project.countDocuments({ category: 'kitchen' }),
      Project.countDocuments({ category: 'full-home' }),
      Enquiry.countDocuments(enquiryFilter),
      Enquiry.countDocuments({ ...enquiryFilter, status: 'New' }),
      Enquiry.countDocuments({ ...enquiryFilter, status: 'Contacted' }),
      Enquiry.countDocuments({ ...enquiryFilter, status: 'Closed' }),
      Testimonial.countDocuments(),
      PopularItem.countDocuments(),
      Admin.countDocuments(clientFilter),
      Admin.countDocuments({ role: 'admin' }),
      Admin.countDocuments({ role: 'superadmin' }),
      Admin.countDocuments(),
      Enquiry.find(enquiryFilter).populate('clientId', 'name companyName').sort({ createdAt: -1 }).limit(10),
      Project.find().sort({ createdAt: -1 }).limit(8),
      PopularItem.find().sort({ createdAt: -1 }).limit(6)
    ]);

    res.json({
      role: currentRole,
      counts: {
        totalProjects,
        livingRoomProjects,
        bedroomProjects,
        kitchenProjects,
        fullHomeProjects,
        totalEnquiries,
        newEnquiries,
        contactedEnquiries,
        closedEnquiries,
        totalTestimonials,
        totalPopularItems,
        totalClients,
        totalAdmins,
        totalSuperadmins,
        totalAccounts
      },
      recentEnquiries,
      recentProjects,
      popularItemsSample
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
