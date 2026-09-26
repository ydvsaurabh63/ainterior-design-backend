import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Replicate from 'replicate';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const REPLICATE_MODEL_VERSION = 'adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38';



const MOCK_REDESIGN_GALLERY = {
  'Living Room': {
    Modern: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    Luxury: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    Contemporary: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    Scandinavian: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    Traditional: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    Industrial: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'
  },
  Bedroom: {
    Modern: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    Luxury: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    Contemporary: 'https://images.unsplash.com/photo-1540518614846-7ede433c5173?auto=format&fit=crop&w=1200&q=80',
    Scandinavian: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    Traditional: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1200&q=80',
    Industrial: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'
  },
  Kitchen: {
    Modern: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    Luxury: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
    Contemporary: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    Scandinavian: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    Traditional: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=1200&q=80',
    Industrial: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80'
  },
  'Full Home': {
    Modern: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    Luxury: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    Minimalist: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    Contemporary: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    Scandinavian: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    Traditional: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
    Industrial: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
  }
};

/**
 * Gets fallback mock design image when Replicate API token is unconfigured or fails
 */
export const getFallbackRedesignImage = (roomType = 'Living Room', style = 'Modern') => {
  const category = MOCK_REDESIGN_GALLERY[roomType] || MOCK_REDESIGN_GALLERY['Living Room'];
  return category[style] || category['Modern'] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80';
};

/**
 * Dynamically builds the AI image generation prompt based on room specs & preservation instructions
 */
export const buildInteriorPrompt = ({ roomType, style, customInstruction }) => {
  let prompt = `Redesign this existing ${roomType} in a ${style} interior design style.

Preserve the original room's architecture, room dimensions, walls, windows, doors, floor structure, camera perspective and overall spatial layout.

Improve the interior by redesigning furniture, colors, materials, lighting, decorations, textures and styling according to the selected design style.

The result must look like a realistic professional interior design photograph.

Keep the room recognizable as the same original room.

Do not completely replace the architecture.

Do not create an unrelated room.

Do not add unrealistic objects.

Maintain realistic proportions and perspective.

Room Type:
${roomType}

Design Style:
${style}`;

  if (customInstruction && customInstruction.trim()) {
    prompt += `\n\nCustom User Requirements:\n${customInstruction.trim()}`;
  }

  return prompt;
};

/**
 * Main service method to trigger AI Room Redesign via Replicate SDK
 */
export const generateRoomRedesign = async ({ file, imageUrl, roomType, style, customInstruction }) => {
  const prompt = buildInteriorPrompt({ roomType, style, customInstruction });
  const rawToken = (process.env.REPLICATE_API_TOKEN || process.env.AI_API_KEY || '').trim();

  // Check if token is a valid Replicate token (starts with r8_ or r8-)
  const isReplicateToken = Boolean(rawToken && (rawToken.startsWith('r8_') || rawToken.startsWith('r8-')));

  if (!isReplicateToken) {
    console.warn(`[AI Interior Service] REPLICATE_API_TOKEN is missing or invalid (tokens must start with 'r8_'). Using fallback mock redesign for ${roomType} (${style}).`);
    return {
      generatedUrl: getFallbackRedesignImage(roomType, style),
      prompt,
      roomType,
      style,
      isMock: true
    };
  }

  try {
    const replicate = new Replicate({
      auth: rawToken
    });

    const negativePrompt = 'lowres, watermark, banner, logo, text, blurry, out of focus, deformed, distorted, surreal, unrealistic furniture, extra objects, bad perspective, changed architecture, unrelated room, duplicate furniture';

    let imageInput = imageUrl;

    if (file && file.path && fs.existsSync(file.path)) {
      const fileBuffer = fs.readFileSync(file.path);
      const mimeType = file.mimetype || 'image/jpeg';
      imageInput = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    } else if (file && file.buffer) {
      const mimeType = file.mimetype || 'image/jpeg';
      imageInput = `data:${mimeType};base64,${file.buffer.toString('base64')}`;
    }

    if (!imageInput) {
      throw new Error('Valid room photo is required for AI redesign');
    }

    console.log(`Submitting Replicate AI Room Redesign job (${roomType} | ${style})...`);

    const output = await replicate.run(REPLICATE_MODEL_VERSION, {
      input: {
        image: imageInput,
        prompt: prompt,
        negative_prompt: negativePrompt,
        guidance_scale: 15,
        prompt_strength: 0.8,
        num_inference_steps: 50
      }
    });

    let generatedUrl = null;

    if (Array.isArray(output) && output.length > 0) {
      const item = output[0];
      if (typeof item === 'string') {
        generatedUrl = item;
      } else if (item && typeof item.url === 'function') {
        generatedUrl = item.url().href || String(item.url());
      } else if (item && item.url) {
        generatedUrl = String(item.url);
      } else if (item) {
        generatedUrl = String(item);
      }
    } else if (typeof output === 'string') {
      generatedUrl = output;
    } else if (output && typeof output.url === 'function') {
      generatedUrl = output.url().href || String(output.url());
    } else if (output && output.url) {
      generatedUrl = String(output.url);
    } else if (output) {
      generatedUrl = String(output);
    }

    if (!generatedUrl || typeof generatedUrl !== 'string' || !generatedUrl.startsWith('http')) {
      throw new Error('Replicate API did not return a valid output image URL');
    }

    console.log('Replicate AI redesign completed successfully!');

    // Permanently host AI generated design on Cloudinary
    if (isCloudinaryConfigured && generatedUrl && generatedUrl.startsWith('http')) {
      try {
        console.log('[Cloudinary] Uploading AI-generated redesign to Cloudinary...');
        const cloudUpload = await cloudinary.uploader.upload(generatedUrl, {
          folder: 'interior-design-studio/ai-generated',
          resource_type: 'image'
        });
        if (cloudUpload && cloudUpload.secure_url) {
          generatedUrl = cloudUpload.secure_url;
          console.log('[Cloudinary] Redesign successfully saved to Cloudinary:', generatedUrl);
        }
      } catch (uploadErr) {
        console.warn('[Cloudinary] Could not re-host generated AI image, using direct URL:', uploadErr.message);
      }
    }

    return {
      generatedUrl,
      prompt,
      roomType,
      style,
      isMock: false
    };
  } catch (error) {
    const isCreditError = Boolean(error && error.message && (error.message.includes('402') || error.message.includes('credit')));
    const errorNotice = isCreditError
      ? 'Replicate account requires credits ($1-2) to process your uploaded room image with AI. Showing design preview.'
      : 'AI redesign service unavailable. Showing design preview.';

    console.warn(`[AI Interior Service] Replicate API call failed (${error.message || error}). ${errorNotice}`);

    return {
      generatedUrl: getFallbackRedesignImage(roomType, style),
      prompt,
      roomType,
      style,
      isMock: true,
      notice: errorNotice
    };
  }
};


