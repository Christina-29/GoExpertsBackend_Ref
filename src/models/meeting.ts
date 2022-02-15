import mongoose, { Schema } from "mongoose";
import { IMeeting } from "../types/meeting";

const meetingSchema = new Schema({
  meetingID: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  meetingDate: {
    type: Date,
    // required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  expertID: {
    type: String,
    ref: "Expert",
    required: true,
  },
  userID: {
    type: String,
    ref: "user",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending Payment", "Awating Response", "Cancelled","Rejected", "Not Completed","Not Reviewed"],
    default: "Pending Payment",
  },
  topic: {
    type: String,
  },
  meetingMethod: {
    type: String,
  },
  comment: {
    type: String,
    default: null,
  },
  rate: {
    type: Number,
    default: null,
  }
});

meetingSchema.virtual('client', {
  ref: 'user',
  localField: 'userID',
  foreignField: 'userID',
  justOne: true
});

meetingSchema.virtual('expert', {
  ref: 'expert',
  localField: 'expertID',
  foreignField: 'expertID',
  justOne: true
});

meetingSchema.set('toObject', { virtuals: true });
meetingSchema.set('toJSON', { virtuals: true });

const Meeting = mongoose.model<IMeeting>("meeting", meetingSchema);

export default Meeting;
