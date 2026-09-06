import express from 'express';
import {
  createMembershipTier,
  getMembershipTiers,
  getAllMembershipTiers,
  updateMembershipTier,
  deleteMembershipTier,
} from '../controllers/membershipTier.controller';
import {
  getMembershipSettings,
  updateMembershipSettings,
} from '../controllers/membershipSettings.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Tiers — public list, admin-protected list, plain-JSON CRUD (no images)
router.get('/tiers', getMembershipTiers);
router.get('/tiers/admin', authenticateToken, getAllMembershipTiers);
router.post('/tiers', createMembershipTier);
router.put('/tiers/:id', updateMembershipTier);
router.delete('/tiers/:id', deleteMembershipTier);

// Settings — singleton (isOpen + registrationUrl)
router.get('/settings', getMembershipSettings);
router.put('/settings', updateMembershipSettings);

export default router;
