import { Request, Response, RequestHandler } from 'express';
import Expert from '../models/expert';

const getSearchbarSugesstion: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { search } = req.query;

  const results = await Expert.find({
    '$or': [
      { firstName: { $regex: `^${search}`, $options: 'i' } },
      { lastName: { $regex: `^${search}`, $options: 'i' } },
      { jobTitle: { $regex: `^${search}`, $options: 'i' } },
    ]
  }, { firstName: 1, lastName: 1, jobTitle: 1 }).exec();

  const names = results.map(element => `${element.lastName} ${element.firstName}`);
  const jobTitles = results.map(element => element.jobTitle);
  const resultArray = names.concat(Array.from(new Set(jobTitles)));

  return res.json(resultArray.sort().slice(0, 5));
};

export default getSearchbarSugesstion;