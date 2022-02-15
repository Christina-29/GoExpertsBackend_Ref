import mongoose from "mongoose";

const SpecialtySchema = new mongoose.Schema({
  specialtyID: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  name: {
    type: String,
    required: true,
  },
});

const Specialty = mongoose.model("specialty", SpecialtySchema);

export default Specialty;
