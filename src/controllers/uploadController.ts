import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'tourism', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file!.buffer);
    });

    const result = (await uploadPromise) as any;

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadMultipleImages = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({ success: false, message: 'No files uploaded' });
      return;
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'tourism', resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        })
    );

    const results = await Promise.all(uploadPromises);

    const uploadedImages = (results as any[]).map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    res.json({
      success: true,
      data: uploadedImages,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      res.status(400).json({ success: false, message: 'Public ID is required' });
      return;
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { uploadImage, uploadMultipleImages, deleteImage };
