import express from 'express';
import multer from 'multer';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/single', protect, admin, upload.single('image'), uploadImage);
router.post('/multiple', protect, admin, upload.array('images', 10), uploadMultipleImages);
router.delete('/', protect, admin, deleteImage);

export default router;
