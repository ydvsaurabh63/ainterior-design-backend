import Project from '../models/Project.js';
import { getUploadedFileUrl } from '../middleware/uploadMiddleware.js';

// Helper to generate slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-') + '-' + Date.now().toString().slice(-4);
};

// @desc    Fetch all projects (with filtering)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { style: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single project by ID or Slug
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    let project;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(id);
    }

    if (!project) {
      project = await Project.findOne({ slug: id });
    }

    if (project) {
      // Also fetch 3 related projects in the same category
      const related = await Project.find({
        category: project.category,
        _id: { $ne: project._id }
      }).limit(3);

      res.json({ project, related });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      area,
      style,
      description,
      materials,
      featured,
      mainImageUrl,
      galleryImageUrls
    } = req.body;

    let mainImage = mainImageUrl;
    let galleryImages = [];

    // Check if uploaded via multer
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      mainImage = getUploadedFileUrl(req.files.mainImage[0], req);
    }

    if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
      const uploadedGallery = req.files.galleryImages.map((file) =>
        getUploadedFileUrl(file, req)
      );
      galleryImages = uploadedGallery;
    }

    // Support gallery URLs passed as string or JSON array
    if (galleryImageUrls) {
      if (Array.isArray(galleryImageUrls)) {
        galleryImages = [...galleryImages, ...galleryImageUrls];
      } else {
        try {
          const parsed = JSON.parse(galleryImageUrls);
          if (Array.isArray(parsed)) galleryImages = [...galleryImages, ...parsed];
        } catch {
          galleryImages = [...galleryImages, galleryImageUrls];
        }
      }
    }

    if (!mainImage) {
      return res.status(400).json({ message: 'Main project image is required' });
    }

    let parsedMaterials = [];
    if (materials) {
      if (Array.isArray(materials)) {
        parsedMaterials = materials;
      } else if (typeof materials === 'string') {
        try {
          parsedMaterials = JSON.parse(materials);
        } catch {
          parsedMaterials = materials.split(',').map((m) => m.trim()).filter(Boolean);
        }
      }
    }

    const slug = createSlug(title || 'project');

    const project = new Project({
      title,
      slug,
      category,
      location,
      area,
      style,
      description,
      materials: parsedMaterials,
      mainImage,
      galleryImages: galleryImages.length > 0 ? galleryImages : [mainImage],
      featured: featured === 'true' || featured === true
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const {
      title,
      category,
      location,
      area,
      style,
      description,
      materials,
      featured,
      mainImageUrl,
      galleryImageUrls
    } = req.body;

    if (title) project.title = title;
    if (category) project.category = category;
    if (location) project.location = location;
    if (area) project.area = area;
    if (style) project.style = style;
    if (description) project.description = description;
    if (featured !== undefined) {
      project.featured = featured === 'true' || featured === true;
    }

    // Update main image if new file or URL provided
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      project.mainImage = getUploadedFileUrl(req.files.mainImage[0], req);
    } else if (mainImageUrl) {
      project.mainImage = mainImageUrl;
    }

    // Update gallery if new files or URLs provided
    let newGallery = [...(project.galleryImages || [])];
    if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
      const uploaded = req.files.galleryImages.map((file) => getUploadedFileUrl(file, req));
      newGallery = [...newGallery, ...uploaded];
    }
    if (galleryImageUrls) {
      try {
        const parsed = JSON.parse(galleryImageUrls);
        if (Array.isArray(parsed)) newGallery = parsed;
      } catch {
        if (Array.isArray(galleryImageUrls)) newGallery = galleryImageUrls;
      }
    }
    project.galleryImages = newGallery;

    if (materials !== undefined) {
      if (Array.isArray(materials)) {
        project.materials = materials;
      } else if (typeof materials === 'string') {
        try {
          project.materials = JSON.parse(materials);
        } catch {
          project.materials = materials.split(',').map((m) => m.trim()).filter(Boolean);
        }
      }
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed successfully' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
