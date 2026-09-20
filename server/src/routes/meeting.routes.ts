import express from "express";
import { authenticate, authorizeRoles, optionalAuthenticate } from "../middleware/auth.middleware";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from "../controllers/meeting.controller";

const router = express.Router();

// Public (the meeting link is only included for people it is meant for)
router.get("/", optionalAuthenticate, getMeetings);
router.get("/:id", optionalAuthenticate, getMeetingById);

// Protected (officers/faculty create & manage)
router.post(
  "/",
  authenticate,
  authorizeRoles("council-officer", "committee-officer", "faculty"),
  createMeeting
);
router.patch(
  "/:id",
  authenticate,
  authorizeRoles("council-officer", "committee-officer", "faculty"),
  updateMeeting
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("council-officer", "committee-officer", "faculty"),
  deleteMeeting
);

export default router;
