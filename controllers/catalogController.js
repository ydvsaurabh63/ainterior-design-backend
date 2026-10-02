import CatalogItem from '../models/CatalogItem.js';
import PopularItem from '../models/PopularItem.js';
import { getUploadedFileUrl } from '../middleware/uploadMiddleware.js';

/**
 * @desc    Get all catalog items with filtering & search (Only admin-added products)
 * @route   GET /api/catalog
 * @access  Public
 */
export const getCatalogItems = async (req, res, next) => {
  try {
    const { clientCategory, objectCategory, search, limit = 1000 } = req.query;

    // Only fetch catalog items created by admin
    let query = {
      section: 'catalog',
      createdBy: { $ne: null }
    };

    // Filter by client category
    if (clientCategory && clientCategory !== 'all') {
      query.clientCategory = clientCategory;
    }

    // Filter by object category
    if (objectCategory && objectCategory !== 'all') {
      query.objectCategory = objectCategory;
    }

    // Search filter across name, description, brand, objectCategory
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { objectCategory: searchRegex },
        { clientCategory: searchRegex }
      ];
    }

    const items = await CatalogItem.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(items || []);
  } catch (error) {
    console.warn('Backend Catalog Query Notice:', error.message);
    res.json([]);
  }
};

/**
 * @desc    Get single catalog item by ID
 * @route   GET /api/catalog/:id
 * @access  Public
 */
export const getCatalogItemById = async (req, res, next) => {
  try {
    const item = await CatalogItem.findOne({
      _id: req.params.id,
      createdBy: { $ne: null }
    });
    if (!item) {
      return res.status(404).json({ message: 'Catalog item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(404).json({ message: 'Catalog item not found' });
  }
};

/**
 * @desc    Create new catalog item
 * @route   POST /api/catalog
 * @access  Private (Admin / Superadmin)
 */
export const createCatalogItem = async (req, res, next) => {
  try {
    const {
      name,
      clientCategory,
      objectCategory,
      description,
      brand,
      price,
      imageUrl,
      stagedRoomImage
    } = req.body;

    let finalImageUrl = imageUrl || '';
    let finalStagedRoomImage = stagedRoomImage || '';

    // Handle file upload if attached via Multer / Cloudinary
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        finalImageUrl = getUploadedFileUrl(req.files.image[0], req) || finalImageUrl;
      }
      if (req.files.stagedRoomImage && req.files.stagedRoomImage[0]) {
        finalStagedRoomImage = getUploadedFileUrl(req.files.stagedRoomImage[0], req) || finalStagedRoomImage;
      }
    } else if (req.file) {
      finalImageUrl = getUploadedFileUrl(req.file, req) || finalImageUrl;
    }

    if (!name || !clientCategory || !objectCategory) {
      res.status(400);
      throw new Error('Please provide name, client category, and object category.');
    }

    if (!finalImageUrl) {
      res.status(400);
      throw new Error('Please upload a product image or provide a product image URL.');
    }

    const newItem = await CatalogItem.create({
      name,
      clientCategory,
      objectCategory,
      imageUrl: finalImageUrl,
      stagedRoomImage: finalStagedRoomImage,
      description: description || '',
      brand: brand || 'AURA Collection',
      price: price || '',
      section: 'catalog',
      createdBy: req.user ? req.user._id : null
    });

    // Auto-sync to PopularItem if added under "Popular items tried by customers"
    if (clientCategory === 'Popular items tried by customers') {
      try {
        await PopularItem.create({
          name,
          brand: brand || 'AURA Collection',
          time: 'Just now',
          dimensions: objectCategory || 'Featured Space',
          price: price || 'Featured',
          category: objectCategory || 'Popular Try-On',
          image: finalImageUrl,
          roomImage: finalStagedRoomImage || finalImageUrl,
          productUrl: '/contact',
          isPopular: true,
          order: -10,
          createdBy: req.user ? req.user._id : null
        });
      } catch (syncErr) {
        console.warn('Sync to PopularItem on create warning:', syncErr.message);
      }
    }

    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update catalog item
 * @route   PUT /api/catalog/:id
 * @access  Private (Admin / Superadmin)
 */
export const updateCatalogItem = async (req, res, next) => {
  try {
    const item = await CatalogItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Catalog item not found');
    }

    const prevName = item.name;
    const {
      name,
      clientCategory,
      objectCategory,
      description,
      brand,
      price,
      imageUrl,
      stagedRoomImage
    } = req.body;

    if (name) item.name = name;
    if (clientCategory) item.clientCategory = clientCategory;
    if (objectCategory) item.objectCategory = objectCategory;
    if (description !== undefined) item.description = description;
    if (brand !== undefined) item.brand = brand;
    if (price !== undefined) item.price = price;

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        item.imageUrl = getUploadedFileUrl(req.files.image[0], req) || item.imageUrl;
      }
      if (req.files.stagedRoomImage && req.files.stagedRoomImage[0]) {
        item.stagedRoomImage = getUploadedFileUrl(req.files.stagedRoomImage[0], req) || item.stagedRoomImage;
      }
    } else if (req.file) {
      item.imageUrl = getUploadedFileUrl(req.file, req) || item.imageUrl;
    }

    if (imageUrl) item.imageUrl = imageUrl;
    if (stagedRoomImage !== undefined) item.stagedRoomImage = stagedRoomImage;

    const updatedItem = await item.save();

    // Auto-sync updates to PopularItem if in 'Popular items tried by customers'
    if (updatedItem.clientCategory === 'Popular items tried by customers') {
      try {
        await PopularItem.findOneAndUpdate(
          { $or: [{ name: prevName }, { name: updatedItem.name }] },
          {
            name: updatedItem.name,
            brand: updatedItem.brand || 'AURA Collection',
            dimensions: updatedItem.objectCategory || 'Featured Space',
            price: updatedItem.price || 'Featured',
            image: updatedItem.imageUrl,
            roomImage: updatedItem.stagedRoomImage || updatedItem.imageUrl,
            isPopular: true
          },
          { upsert: true, new: true }
        );
      } catch (syncErr) {
        console.warn('Sync to PopularItem on update warning:', syncErr.message);
      }
    }

    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete catalog item
 * @route   DELETE /api/catalog/:id
 * @access  Private (Admin / Superadmin)
 */
export const deleteCatalogItem = async (req, res, next) => {
  try {
    const item = await CatalogItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Catalog item not found');
    }

    if (item.clientCategory === 'Popular items tried by customers') {
      try {
        await PopularItem.deleteOne({ name: item.name });
      } catch (syncErr) {
        console.warn('Sync to PopularItem on delete warning:', syncErr.message);
      }
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Catalog item removed' });
  } catch (error) {
    next(error);
  }
};
