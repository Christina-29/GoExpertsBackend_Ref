import Mongoose from "mongoose";

export interface ITimePeriod {
  start: Date;
  duration: number;
}

export interface IReview {
  rating: number;
  comment: string;
}

export interface IExpert {
  userID: string;
  expertID: string;
  active: boolean;
  status: "unverified" | "inprogress" | "verified";
  jobTitle: string;
  location: string;
  organization?: string;
  specialities?: string[];
  topics?: string[];
  personalIntroduction?: string;
  photoId?: string;
  certificates?: string[];
  availability?: {
    week: ITimePeriod[];
    day: ITimePeriod[];
  };
  yearsOfExperience?: Date;
  followers?: string[];
  photo?: string;
  reviews?: IReview[];
  averageRating?: Mongoose.Decimal128;
  bookedAmount?: number;
  price?: number;
  firstName: string;
  lastName: string;
  chattingOnline?: boolean;
  chattingOffline?: boolean;
  createDate?: Date;
}

export interface IGetExpertsQueries {
  page: number;
  priceFrom: number;
  priceTo: number;
  chattingOnline: boolean;
  chattingOffline: boolean;
  sort: string;
  location: string;
  keyword: string;
}
export interface IExpertFilter {
  price?: { $gt: number; $lt: number };
  chattingOnline?: boolean;
  chattingOffline?: boolean;
  location?: { $regex: string; $options: string };
  $or: (
    | {
        $expr: {
          $regexMatch: {
            input: { $concat: string[] };
            regex: string;
            options: string;
          };
        };
      }
    | { jobTitle: { $regex: string; $options: string } }
    | { specialities: { $regex: string; $options: string } }
  )[];
}

export interface IExpertSortBy {
  averageRating?: number;
  bookedAmount?: number;
  createDate?: number;
}
