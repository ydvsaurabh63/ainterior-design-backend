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
    // 1. Image Validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No room photo uploaded. Please select a valid JPG, PNG, or WEBP image.'
      });
    }

    const imageUrl = getUploadedFileUrl(req.file, req);
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Failed to process uploaded image file.'
      });
    }

    // 2. Spec Validation
    const {
      roomType = 'Living Room',
      style = 'Modern',
      designStyle = 'Modern',
      customInstruction = '',
      customPrompt = ''
    } = req.body;

    const selectedRoomType = (roomType || 'Living Room').trim();
    const selectedStyle = (style || designStyle || 'Modern').trim();
    const selectedCustomPrompt = (customInstruction || customPrompt || '').trim();

    const formattedRoomType = VALID_ROOM_TYPES.find(
      (r) => r.toLowerCase() === selectedRoomType.toLowerCase()
    ) || selectedRoomType || 'Living Room';

    const formattedStyle = VALID_DESIGN_STYLES.find(
      (s) => s.toLowerCase() === selectedStyle.toLowerCase()
    ) || selectedStyle || 'Modern';

    const sanitizedInstruction = selectedCustomPrompt.slice(0, 500);

    // 3. Call Replicate AI Service
    const redesignResult = await generateRoomRedesign({
      file: req.file,
      imageUrl,
      roomType: formattedRoomType,
      style: formattedStyle,
      customInstruction: sanitizedInstruction
    });

    return res.status(200).json({
      success: true,
      imageUrl: redesignResult.generatedUrl,
      originalUrl: imageUrl,
      notice: redesignResult.notice || null,
      data: {
        originalUrl: imageUrl,
        generatedUrl: redesignResult.generatedUrl,
        prompt: redesignResult.prompt,
        roomType: formattedRoomType,
        style: formattedStyle,
        customInstruction: sanitizedInstruction,
        isMock: redesignResult.isMock,
        notice: redesignResult.notice || null
      },
      message: redesignResult.notice || 'Room design generated successfully.'
    });
  } catch (error) {
    console.error('Error in redesignRoom controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while generating room design. Please try again.'
    });
  }
};
