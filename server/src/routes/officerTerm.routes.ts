import express from 'express';
import {
  createOfficerTerm,
  getOfficerTerms,
  getOfficerTermYears,
  getAllOfficerTerms,
  updateOfficerTerm,
  deleteOfficerTerm,
} from '../controllers/officerTerm.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/years', getOfficerTermYears);
router.get('/', getOfficerTerms);

// Protected routes
router.get('/admin', authenticateToken, getAllOfficerTerms);
router.post('/', upload.single('image'), createOfficerTerm);
router.put('/:id', upload.single('image'), updateOfficerTerm);
router.delete('/:id', deleteOfficerTerm);

export default router;
