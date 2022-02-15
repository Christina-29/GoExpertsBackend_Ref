import mongoose from "mongoose";

const SpecialtySchema = new mongoose.Schema({
  messageID: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  content: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  expertID: {
    type: String,
    required: true,
  },
  clientID: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  declinedReason: {
    type: String,
  },
  topic: {
    type: String,
    required: true,
  },
  meetingMethods: [
    {
      type: String,
      required: true,
    },
  ],
  availability: [
    {
      type: Date,
      default: Date.now(),
      required: true,
    },
  ],
});

const Specialty = mongoose.model("specialty", SpecialtySchema);

export default Specialty;
