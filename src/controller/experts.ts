import { Request, Response, RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import Expert from "../models/expert";
import User from "../models/users";
import {
  IGetExpertsQueries,
  IExpertFilter,
  IExpertSortBy,
} from "../types/expert";
import sortingType from "../types/sortingType";
import { IUser } from "../types/user";

/**
 * POST api/experts
 * @description create an expert
 * @param req
 * @param res
 * @returns created expert
 */
export const createExpert: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { userID, jobTitle, location, price } = req.body;
  if (!userID || !jobTitle || !location || !price) {
    return res.status(400).json({ error: "Please enter all required fields." });
  }
  const user = await User.findOne({ userID });
  if (!user) {
    return res.status(400).json({ error: "No such user." });
  }
  const { firstName, lastName } = user as IUser;
  const expertID = uuidv4();
  const expert = new Expert({
    expertID,
    userID,
    jobTitle,
    location,
    price,
    firstName,
    lastName,
  });
  try {
    await expert.save();
    return res.status(200).send(expert);
  } catch (error) {
    return res.status(400).send(error);
  }
};

/**
 * GET api/experts:id
 * @description get an expert details by expertID
 * @param req
 * @param res
 * @returns searched expert
 */
export const getExpertById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const expertID = req.params.id;
  const expert = await Expert.findOne({ expertID });
  if (!expert) {
    return res.status(400).json({ error: "No such expert." });
  }
  return res.status(200).json(expert);
};

/**
 * GET api/experts/recommendationList
 * @description get top 10 rating experts' info
 * @param req
 * @param res
 * @returns expertInfo array
 */
export const getRecommendedExperts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const experts = await Expert.find().sort({ averageRating: -1 }).limit(10);
    return res.status(200).json(experts);
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const getExperts: RequestHandler = async (
  req: Request,
  res: Response
) => {
  // request queries
  const queries: IGetExpertsQueries = {
    page: parseInt(req.query.page as string, 10),
    priceFrom: parseInt(req.query.priceFrom as string, 10),
    priceTo: parseInt(req.query.priceTo as string, 10),
    chattingOnline: req.query.online === "true",
    chattingOffline: req.query.offline === "true",
    sort: req.query.sort as string,
    location: req.query.location as string,
    keyword: req.query.keyword as string,
  };

  if (!queries.page || queries.page < 0) {
    return res.status(400).send("Invalid query.");
  }
  if (queries.priceFrom < 0 || queries.priceFrom > queries.priceTo) {
    return res.status(400).send("Invalid query.");
  }

  // db search filter
  const filter: any = {
    price: { $gt: queries.priceFrom, $lt: queries.priceTo },
    location: { $regex: `^${queries.location}`, $options: "i" },
    $or: [
      {
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstName", " ", "$lastName"] },
            regex: queries.keyword,
            options: "i",
          },
        },
      },
      {
        jobTitle: { $regex: `${queries.keyword}`, $options: "i" },
      },
      {
        specialities: { $regex: `${queries.keyword}`, $options: "i" },
      },
    ],
  };
  if (!queries.chattingOffline && queries.chattingOnline) {
    filter.chattingOnline = true;
  } else if (queries.chattingOffline && !queries.chattingOnline) {
    filter.chattingOffline = true;
  }

  // db sort
  const sortBy: IExpertSortBy = {};
  if (queries.sort === sortingType.RECOMMEND) {
    sortBy.averageRating = -1;
  } else if (queries.sort === sortingType.PUBLISH_DATE) {
    sortBy.createDate = -1;
  } else if (queries.sort === sortingType.POPULAR) {
    sortBy.bookedAmount = -1;
  }

  try {
    // pagination
    const count = await Expert.find(filter).count();
    const totalPages = Math.ceil(count / 12);
    if (totalPages > 0 && queries.page > totalPages) {
      return res.status(400).send("Query out of range");
    }

    const experts = await Expert.find(filter)
      .sort(sortBy)
      .limit(12)
      .skip((queries.page - 1) * 12)
      .exec();

    return res.json({ experts, totalPages, curPage: queries.page });
  } catch (error) {
    return res.status(400).send(error);
  }
};
