import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
  paymentID: {},
  clientID: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  expertID: {
    type: Schema.Types.ObjectId,
    ref: "Expert",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Success", "Fail", "Inprogress"],
    required: true,
    default: "Inprogress",
  },
});

const Payment = mongoose.model("payment", paymentSchema);

export default Payment;
