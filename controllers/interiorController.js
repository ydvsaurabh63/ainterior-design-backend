import { getUploadedFileUrl } from '../middleware/uploadMiddleware.js';
import { generateRoomRedesign } from '../services/aiInteriorService.js';

const VALID_ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Full Home'];
const VALID_DESIGN_STYLES = [
  'Modern',
  'Luxury',
  'Minimalist',
  'Contemporary',
  'Scandinavian',
  'Traditional',
  'Industrial'
];

/**
 * @desc    Generate AI Room Redesign
 * @route   POST /api/interior/redesign or POST /api/redesign-room
 * @access  Public
 */
export const redesignRoom = async (req, res, next) => {
  try {
    const {
      roomType = 'Living Room',
      style = 'Modern',
      designStyle = 'Modern',
      productName = '',
      productImageUrl = '',
      customInstruction = '',
      customPrompt = '',
      imagePreviewUrl = ''
    } = req.body;

    let imageUrl = '';

    // 1. Image Validation (from uploaded file or preview URL)
    if (req.file) {
      imageUrl = getUploadedFileUrl(req.file, req);
    } else if (imagePreviewUrl && typeof imagePreviewUrl === 'string' && imagePreviewUrl.startsWith('http')) {
      imageUrl = imagePreviewUrl;
    } else if (imagePreviewUrl && typeof imagePreviewUrl === 'string' && imagePreviewUrl.startsWith('data:image/')) {
      imageUrl = imagePreviewUrl;
    }

    if (!imageUrl && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'No room photo uploaded. Please select a valid JPG, PNG, or WEBP image.'
      });
    }

    // 2. Spec Validation
    const selectedRoomType = (roomType || 'Living Room').trim();
    const selectedStyle = (style || designStyle || 'Modern').trim();
    const selectedProductName = (productName || selectedStyle || '').trim();
    const selectedCustomPrompt = (customInstruction || customPrompt || '').trim();

    const formattedRoomType = VALID_ROOM_TYPES.find(
      (r) => r.toLowerCase() === selectedRoomType.toLowerCase()
    ) || selectedRoomType || 'Living Room';

    const formattedStyle = VALID_DESIGN_STYLES.find(
      (s) => s.toLowerCase() === selectedStyle.toLowerCase()
    ) || selectedStyle || 'Modern';

    const sanitizedInstruction = selectedCustomPrompt.slice(0, 500);

    // 3. Call PixVerse / Replicate AI Service
    const redesignResult = await generateRoomRedesign({
      file: req.file,
      imageUrl: imageUrl || getUploadedFileUrl(req.file, req),
      roomType: formattedRoomType,
      style: formattedStyle,
      productName: selectedProductName,
      productImageUrl: (productImageUrl || '').trim(),
      customInstruction: sanitizedInstruction
    });

    return res.status(200).json({
      success: true,
      imageUrl: redesignResult.generatedUrl,
      originalUrl: imageUrl,
      data: {
        originalUrl: imageUrl,
        generatedUrl: redesignResult.generatedUrl,
        prompt: redesignResult.prompt,
        roomType: formattedRoomType,
        style: formattedStyle,
        productName: selectedProductName,
        productImageUrl,
        customInstruction: sanitizedInstruction
      },
      message: 'Room design generated successfully.'
    });
  } catch (error) {
    console.error('Error in redesignRoom controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while generating room design. Please try again.'
    });
  }
};
