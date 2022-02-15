import express from "express";
import {
  createExpert,
  getExpertById,
  getRecommendedExperts,
  getExperts,
} from "../controller/experts";

const router = express.Router();

/** GET expert search */
router.get("/", getExperts)

/** POST expert create */
router.post("/", createExpert);

/** GET expert recomended */
router.get("/recommendationList", getRecommendedExperts);

/** GET expert detail */
router.get("/:id", getExpertById);

export default router;
