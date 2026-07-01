import express from 'express';
import multer from 'multer';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/single', protect, upload.single('image'), uploadImage);
router.post('/multiple', protect, upload.array('images', 10), uploadMultipleImages);
router.delete('/', protect, admin, deleteImage);

export default router;
