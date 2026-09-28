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
  const rawToken = (process.env.PIXVERSE_API_KEY || process.env.REPLICATE_API_TOKEN || process.env.AI_API_KEY || '').trim();

  // Check if token is present
  const isTokenValid = Boolean(rawToken && rawToken.length > 3);

  if (!isTokenValid) {
    throw new Error('AI API Key is missing. Please check REPLICATE_API_TOKEN or PIXVERSE_API_KEY in backend .env');
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

    const prompt = buildInteriorPrompt({ roomType, style, customInstruction });

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
      style
    };
  } catch (error) {
    console.error(`[AI Interior Service] Replicate API call failed: ${error.message || error}`);
    throw error;
  }
};


