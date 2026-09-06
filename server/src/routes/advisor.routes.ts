import express from 'express';
import { createAdvisor, getAdvisors, getAllAdvisors, updateAdvisor, deleteAdvisor } from '../controllers/advisor.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getAdvisors);

// Protected routes
router.get('/admin', authenticateToken, getAllAdvisors);
router.post('/', upload.single('image'), createAdvisor);
router.put('/:id', upload.single('image'), updateAdvisor);
router.delete('/:id', deleteAdvisor);

export default router;
