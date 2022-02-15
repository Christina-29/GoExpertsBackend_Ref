import express from "express";
import {
  create, createCommentByMeetingID, getCommentByExpertID, getMeetingByExpertID, getMeetingByUserID
} from '../controller/meeting';
import authGuard from '../middleware/authGuard';

const router = express.Router();

// POST create meeting
router.post("/", create);

// POST create comment for meeting
router.put("/:meetingID", createCommentByMeetingID);

// GET get all comment by expertID
router.get("/comments/:expertID", getCommentByExpertID);

// GET get all meeting by expertID
router.get("/experts/:id", authGuard, getMeetingByExpertID);

// GET get all meeting by userID
router.get("/users/:id", authGuard, getMeetingByUserID);

export default router;
