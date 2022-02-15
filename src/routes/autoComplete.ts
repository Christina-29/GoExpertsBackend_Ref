import express from "express";
import getSearchbarSugesstion from "../controller/autoComplete";

const router = express.Router();

router.get("/:text", getSearchbarSugesstion);

export default router;
