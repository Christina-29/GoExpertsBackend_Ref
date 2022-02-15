import express from "express";
import IndexController from "../controller/index";

const router = express.Router();

/* GET home page. */
router.get("/", IndexController);

export default router;
