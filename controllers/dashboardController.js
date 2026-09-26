import Project from '../models/Project.js';
import Enquiry from '../models/Enquiry.js';
import Testimonial from '../models/Testimonial.js';

// @desc    Get dashboard metrics & statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
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
      recentEnquiries,
      recentProjects
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ category: 'living-room' }),
      Project.countDocuments({ category: 'bedroom' }),
      Project.countDocuments({ category: 'kitchen' }),
      Project.countDocuments({ category: 'full-home' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      Enquiry.countDocuments({ status: 'Contacted' }),
      Enquiry.countDocuments({ status: 'Closed' }),
      Testimonial.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Project.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
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
        totalTestimonials
      },
      recentEnquiries,
      recentProjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
