import express from "express";
import login from "../controller/token";

const router = express.Router();

/** Generate a token when user login by email and password */
router.post("/", login);

export default router;
