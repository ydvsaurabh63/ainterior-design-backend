import RoomDesign from '../models/RoomDesign.js';
import { getUploadedFileUrl } from '../middleware/uploadMiddleware.js';
import { ensureRoomDesignsSeeded, initialRoomDesigns } from '../utils/seedRoomDesigns.js';

// @desc    Get room designs filtered by category or all
// @route   GET /api/room-designs
// @access  Public
export const getRoomDesigns = async (req, res) => {
  try {
    await ensureRoomDesignsSeeded();

    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category.toLowerCase().trim();
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const designs = await RoomDesign.find(query)
      .populate('createdBy', 'name email role')
      .sort({ order: 1, createdAt: -1 });

    if (designs.length === 0 && !search) {
      // Fallback to initial designs if database collection is empty
      const fallback = (category && category !== 'all')
        ? initialRoomDesigns.filter((d) => d.category.toLowerCase() === category.toLowerCase().trim())
        : initialRoomDesigns;
      return res.json(fallback);
    }

    res.json(designs);
  } catch (error) {
    console.error('Error fetching room designs:', error);
    const { category } = req.query;
    const fallback = (category && category !== 'all')
      ? initialRoomDesigns.filter((d) => d.category.toLowerCase() === category.toLowerCase().trim())
      : initialRoomDesigns;
    res.json(fallback);
  }
};

// @desc    Get single room design by ID
// @route   GET /api/room-designs/:id
// @access  Public
export const getRoomDesignById = async (req, res) => {
  try {
    const design = await RoomDesign.findById(req.params.id).populate('createdBy', 'name email role');
    if (!design) {
      return res.status(404).json({ message: 'Room design not found' });
    }
    res.json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new room design
// @route   POST /api/room-designs
// @access  Private (Superadmin, Admin)
export const createRoomDesign = async (req, res) => {
  try {
    const { title, description = '', category, imageUrl: bodyImageUrl, order = 0 } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Design title is required' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required (bedroom, living-room, kitchen, wall-paint-colors)' });
    }

    let finalImageUrl = bodyImageUrl;
    if (req.file) {
      finalImageUrl = getUploadedFileUrl(req.file, req);
    }

    if (!finalImageUrl) {
      return res.status(400).json({ message: 'Design image or image URL is required' });
    }

    const newDesign = await RoomDesign.create({
      title: title.trim(),
      description: description.trim(),
      category: category.toLowerCase().trim(),
      imageUrl: finalImageUrl,
      order: Number(order) || 0,
      createdBy: req.admin?._id
    });

    res.status(201).json(newDesign);
  } catch (error) {
    console.error('Error creating room design:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing room design
// @route   PUT /api/room-designs/:id
// @access  Private (Superadmin, Admin)
export const updateRoomDesign = async (req, res) => {
  try {
    const design = await RoomDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Room design not found' });
    }

    const { title, description, category, imageUrl: bodyImageUrl, order } = req.body;

    if (title !== undefined) design.title = title.trim();
    if (description !== undefined) design.description = description.trim();
    if (category !== undefined) design.category = category.toLowerCase().trim();
    if (order !== undefined) design.order = Number(order) || 0;

    if (req.file) {
      design.imageUrl = getUploadedFileUrl(req.file, req);
    } else if (bodyImageUrl && bodyImageUrl.trim()) {
      design.imageUrl = bodyImageUrl.trim();
    }

    const updatedDesign = await design.save();
    res.json(updatedDesign);
  } catch (error) {
    console.error('Error updating room design:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room design
// @route   DELETE /api/room-designs/:id
// @access  Private (Superadmin, Admin)
export const deleteRoomDesign = async (req, res) => {
  try {
    const design = await RoomDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Room design not found' });
    }

    await design.deleteOne();
    res.json({ message: 'Room design removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting room design:', error);
    res.status(500).json({ message: error.message });
  }
};
