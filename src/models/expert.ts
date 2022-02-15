import mongoose from "mongoose";
import { IExpert } from "../types/expert";

const ExpertSchema = new mongoose.Schema({
  expertID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  organization: {
    type: String,
  },
  specialities: [
    {
      type: String,
    },
  ],
  topics: [
    {
      type: String,
    },
  ],
  personalIntroduction: {
    type: String,
  },
  photoId: {
    type: String,
    select: false,
  },
  certificates: [
    {
      type: String,
    },
  ],
  availability: {
    type: {
      week: [{ start: Date, duration: Number }],
      day: [{ start: Date, duration: Number }],
    },
  },
  status: {
    type: String,
    default: "unverified",
    required: true,
  },
  yearsOfExperience: {
    type: Date,
  },
  followers: [
    {
      type: String,
    },
  ],
  photo: {
    type: String,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  reviews: {
    type: {
      rating: Number,
      comment: String,
    },
  },
  averageRating: {
    type: Number,
    default: 6.0,
  },
  bookedAmount: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  chattingOnline: {
    type: Boolean,
    default: true,
  },
  chattingOffline: {
    type: Boolean,
    default: true,
  },
  createDate: {
    type: Date,
  }
});

const Expert = mongoose.model<IExpert>("expert", ExpertSchema);

export default Expert;
