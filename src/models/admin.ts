import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  adminID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("admin", AdminSchema);

export default Admin;
