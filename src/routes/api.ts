import express from "express";
import usersRouter from "./users";
import tokenRouter from "./token";
import expertsRouter from "./experts";
import topicRouter from './topic';
import meetingRouter from './meeting';
import autoCompleteRouter  from "../controller/autoComplete";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("APIs working");
});

router.use("/users", usersRouter);
router.use("/token", tokenRouter);
router.use("/experts", expertsRouter);
router.use("/topics", topicRouter);
router.use("/meetings", meetingRouter);
router.use("/search", autoCompleteRouter);

export default router;
