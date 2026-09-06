import express from "express";
import {
  getOfficers,
  getPublicOfficers,
  updateOfficer,
  searchNonOfficers,
} from "../controllers/officer.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/public", getPublicOfficers);
router.get("/search", protect, searchNonOfficers);
router.get("/", protect, getOfficers);
router.put("/:id", protect, updateOfficer);

export default router;
