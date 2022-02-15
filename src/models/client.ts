import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  clientID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  avtice: {
    type: Boolean,
    required: true,
  },
  specialties: [
    {
      type: String,
      required: true,
    },
  ],
  followedExpert: [
    {
      type: String,
      required: true,
    },
  ],
});

const Client = mongoose.model("client", ClientSchema);

export default Client;
