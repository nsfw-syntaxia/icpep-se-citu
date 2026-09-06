import express from 'express';
import { createFaculty, getFaculty, getAllFaculty, updateFaculty, deleteFaculty } from '../controllers/faculty.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getFaculty);

// Protected routes
router.get('/admin', authenticateToken, getAllFaculty);
router.post('/', upload.single('image'), createFaculty);
router.put('/:id', upload.single('image'), updateFaculty);
router.delete('/:id', deleteFaculty);

export default router;
