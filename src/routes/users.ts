import express from "express";
import { getUsers, resetPassword, sendPasswordResetLink, signUp, verifyEmail } from "../controller/users";

const router = express.Router();

/* GET users listing. */
router.get("/", getUsers);

/** POST user signup */
router.post("/", signUp);

router.put("/password-reset-link", sendPasswordResetLink);

/** PUT user reset password */
router.put("/password", resetPassword);

/** GET user email verification */
router.get("/verification/email", verifyEmail);

export default router;
