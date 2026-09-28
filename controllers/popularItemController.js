import PopularItem from '../models/PopularItem.js';
import Project from '../models/Project.js';
import { getUploadedFileUrl } from '../middleware/uploadMiddleware.js';
import { ensurePopularItemsSeeded, initialPopularItems } from '../utils/seedPopularItems.js';

// @desc    Fetch popular items for public frontend showcase
// @route   GET /api/popular-items
// @access  Public
export const getPopularItems = async (req, res) => {
  try {
    await ensurePopularItemsSeeded();

    const items = await PopularItem.find({ isPopular: true }).sort({ order: 1, createdAt: -1 });

    // Also fetch uploaded projects to guarantee any uploaded project appears immediately
    let projects = [];
    try {
      projects = await Project.find({ mainImage: { $exists: true, $ne: '' } }).sort({ createdAt: -1 });
    } catch (e) {
      console.warn('Could not fetch projects in getPopularItems:', e.message);
    }

    // Map projects into popular item cards
    const existingNames = new Set(items.map((i) => (i.name || '').toLowerCase().trim()));
    const projectItems = projects
      .filter((p) => p.title && !existingNames.has(p.title.toLowerCase().trim()))
      .map((p) => ({
        _id: p._id,
        name: p.title,
        brand: 'Aura Studio',
        time: 'Just now',
        dimensions: p.area || 'Custom Space',
        price: 'Featured',
        category: p.category === 'living-room' ? 'Living Room' : (p.category || 'Portfolio'),
        image: p.mainImage,
        roomImage: p.mainImage,
        productUrl: `/projects/${p.slug || p._id}`,
        isPopular: true,
        order: -1
      }));

    const combined = [...projectItems, ...items];

    if (combined.length === 0) {
      return res.json(initialPopularItems);
    }

    res.json(combined);
  } catch (error) {
    console.error('Error in getPopularItems:', error);
    res.json(initialPopularItems);
  }
};

// @desc    Fetch all popular try-on items for Admin Panel
// @route   GET /api/popular-items/admin
// @access  Private (superadmin, admin)
export const getAllItemsAdmin = async (req, res) => {
  try {
    await ensurePopularItemsSeeded();

    const { search, category, status } = req.query;
    let query = {};

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { brand: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status === 'active') {
      query.isPopular = true;
    } else if (status === 'inactive') {
      query.isPopular = false;
    }

    const items = await PopularItem.find(query)
      .populate('createdBy', 'name email role')
      .sort({ order: 1, createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single popular item by ID
// @route   GET /api/popular-items/:id
// @access  Public
export const getPopularItemById = async (req, res) => {
  try {
    const item = await PopularItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new popular try-on product
// @route   POST /api/popular-items
// @access  Private (superadmin, admin)
export const createPopularItem = async (req, res) => {
  try {
    const {
      name,
      brand,
      time,
      dimensions,
      price,
      category,
      imageUrl,
      roomImage,
      productUrl,
      isPopular,
      order
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    // Determine product image: from uploaded file or provided URL
    let finalImageUrl = imageUrl ? imageUrl.trim() : '';

    if (req.file) {
      finalImageUrl = getUploadedFileUrl(req.file, req);
    } else if (req.files && req.files['image'] && req.files['image'][0]) {
      finalImageUrl = getUploadedFileUrl(req.files['image'][0], req);
    }

    if (!finalImageUrl) {
      return res.status(400).json({ message: 'Please upload an image or provide an image URL' });
    }

    // Default room image if none provided
    const defaultRoomImage =
      category && category.toLowerCase().includes('chair')
        ? '/sample-rooms/room-furnished-armchair.jpg'
        : category && category.toLowerCase().includes('sectional')
        ? '/sample-rooms/room-furnished-sectional.jpg'
        : '/sample-rooms/room-furnished-sofa.jpg';

    const newItem = new PopularItem({
      name: name.trim(),
      brand: brand && brand.trim() ? brand.trim() : 'Studio Selection',
      time: time && time.trim() ? time.trim() : 'Just now',
      dimensions: dimensions && dimensions.trim() ? dimensions.trim() : 'Custom Size',
      price: price && price.trim() ? price.trim() : '$0',
      category: category && category.trim() ? category.trim() : 'Living Room',
      image: finalImageUrl,
      roomImage: roomImage && roomImage.trim() ? roomImage.trim() : defaultRoomImage,
      productUrl: productUrl && productUrl.trim() ? productUrl.trim() : '',
      isPopular: isPopular !== undefined ? (isPopular === 'true' || isPopular === true) : true,
      order: order ? Number(order) : 0,
      createdBy: req.admin?._id
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating popular item:', error);
    res.status(500).json({ message: error.message || 'Failed to create popular item' });
  }
};

// @desc    Update popular item
// @route   PUT /api/popular-items/:id
// @access  Private (superadmin, admin)
export const updatePopularItem = async (req, res) => {
  try {
    const item = await PopularItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      brand,
      time,
      dimensions,
      price,
      category,
      imageUrl,
      roomImage,
      productUrl,
      isPopular,
      order
    } = req.body;

    if (name !== undefined) item.name = name.trim();
    if (brand !== undefined) item.brand = brand.trim();
    if (time !== undefined) item.time = time.trim();
    if (dimensions !== undefined) item.dimensions = dimensions.trim();
    if (price !== undefined) item.price = price.trim();
    if (category !== undefined) item.category = category.trim();
    if (roomImage !== undefined) item.roomImage = roomImage.trim();
    if (productUrl !== undefined) item.productUrl = productUrl.trim();
    if (isPopular !== undefined) item.isPopular = isPopular === 'true' || isPopular === true;
    if (order !== undefined) item.order = Number(order);

    // If new file uploaded
    if (req.file) {
      item.image = getUploadedFileUrl(req.file, req);
    } else if (req.files && req.files['image'] && req.files['image'][0]) {
      item.image = getUploadedFileUrl(req.files['image'][0], req);
    } else if (imageUrl && imageUrl.trim()) {
      item.image = imageUrl.trim();
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating popular item:', error);
    res.status(500).json({ message: error.message || 'Failed to update popular item' });
  }
};

// @desc    Delete popular item
// @route   DELETE /api/popular-items/:id
// @access  Private (superadmin, admin)
export const deletePopularItem = async (req, res) => {
  try {
    const item = await PopularItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await item.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
