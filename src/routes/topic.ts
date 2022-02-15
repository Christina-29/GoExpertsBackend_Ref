import express from "express";
import topicOfInterest from "../controller/topic";

const router = express.Router();
router.get("/", topicOfInterest);

export default router;
