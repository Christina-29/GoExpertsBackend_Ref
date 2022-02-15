import { Request, Response, RequestHandler } from 'express';
import { v4 as uuidv4 } from "uuid";
import Meeting from '../models/meeting';
import { IcreateCommentQueries } from '../types/meeting';
import Expert from "../models/expert";

/**
 * POST api/meetings
 * @description create a meeting 
 * @param req
 * @param res
 * @returns created meeting 
 */
export const create: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { expertID, userID, meetingDate, price } = req.body;
  const meetingID = uuidv4();

  const meeting = new Meeting({
    meetingID,
    expertID,
    userID,
    price,
    meetingDate,
  });

  try {
    await meeting.save();
    return res.status(201).json(meeting);
  } catch (error) {
    return res.status(400).send(error);
  }
};

/**
 * PUT api/meetings/:meetingID
 * @description add comment and rate for meeting
 * @param req
 * @param res
 * @returns edit meeting with comment and rate
 */
export const createCommentByMeetingID: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { meetingID } = req.params;
  const { comment, rate }: IcreateCommentQueries = req.body;

  const meeting = await Meeting.findOneAndUpdate({
    meetingID
  }, {
    comment,
    rate,
    status: "Rated",
  }, {
    new: true
  }).exec();

  if (!meeting) {
    return res.sendStatus(404).json({ error: "Meeting not exist!" });
  }
  return res.status(200).json(meeting);

};

/**
 * PUT api/meetings/comments/:expertID
 * @description search comment by expertID
 * @param req
 * @param res
 * @returns comments for expert
 */
export const getCommentByExpertID: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { expertID } = req.params;
  const projection = { _id: 0, expertID: 0, price: 0, status: 0 };

  const meeting = await Meeting.find({
    expertID, 
    comment: { $ne: undefined } 
  }, projection)
  .populate('client', { _id: 0, firstName: 1, lastName: 1, avatar: 1 }).exec();

  return res.json(meeting);
};

/**
 * GET api/meetings/experts/:id
 * @description search meetings by expertID
 * @param req
 * @param res
 * @returns meetings for expert
 */
export const getMeetingByExpertID: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const userID = req.params.id;
  const expert = await Expert.findOne({ userID });
  if (!expert) {
    return res.status(401).json({ error: "This user is not an expert" });
  }
  const meeting = await Meeting.find({expertID: expert.expertID})
    .populate('client', { _id: 0, firstName: 1, lastName: 1, avatar: 1 }).exec();
  return res.json(meeting);
};

/**
 * GET api/meetings/users/:id
 * @description search meetings by userID
 * @param req
 * @param res
 * @returns meetings for user
 */
export const getMeetingByUserID: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const userID = req.params.id;
  const meeting = await Meeting.find({userID})
    .populate('expert', { _id: 0, firstName: 1, lastName: 1, jobTitle: 1, avatar: 1 }).exec();
  return res.json(meeting);
};

module.exports = { create, createCommentByMeetingID, getCommentByExpertID, getMeetingByExpertID, getMeetingByUserID};
