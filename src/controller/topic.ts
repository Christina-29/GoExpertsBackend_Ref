import { Request, Response } from "express";
import Topic from "../models/topic";

/**
 * send back the normal Interest List and the recommended interest list
 * 
 * @param {Request} req -http req  
 * @param {Response} res -express http response 
 * @return void
 */

export const topicOfInterest = async (req: Request, res: Response) :Promise<void> => {
  try {
    const topicOfInterest = await Topic.find({});
    res.status(200).json(topicOfInterest);
  } catch(error) {
    res.status(404).json(error);
  }
}

export default topicOfInterest;
