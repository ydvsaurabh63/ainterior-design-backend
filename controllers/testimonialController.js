import Testimonial from '../models/Testimonial.js';
import { getUploadedFileUrl } from '../middleware/uploadMiddleware.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res) => {
  try {
    const { name, role, rating, review, imageUrl } = req.body;

    let image = imageUrl;
    if (req.file) {
      image = getUploadedFileUrl(req.file, req);
    }

    if (!image) {
      image = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=300&q=80`;
    }

    if (!name || !review) {
      return res.status(400).json({ message: 'Client name and review are required' });
    }

    const testimonial = new Testimonial({
      name,
      role: role || 'Homeowner',
      rating: Number(rating) || 5,
      review,
      image
    });

    const saved = await testimonial.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const { name, role, rating, review, imageUrl } = req.body;

    if (name) testimonial.name = name;
    if (role) testimonial.role = role;
    if (rating !== undefined) testimonial.rating = Number(rating);
    if (review) testimonial.review = review;

    if (req.file) {
      testimonial.image = getUploadedFileUrl(req.file, req);
    } else if (imageUrl) {
      testimonial.image = imageUrl;
    }

    const updated = await testimonial.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ message: 'Testimonial deleted successfully' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
