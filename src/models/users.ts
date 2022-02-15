import mongoose from "mongoose";
import { IUser } from "../types/user.d";

const UserSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  avatar: {
    type: String,
  },
  entryDate: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
  },
  confirmEmailToken: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model<IUser>("user", UserSchema);

export default User;
