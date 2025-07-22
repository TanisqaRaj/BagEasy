import mongoose from "mongoose";
const signup = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

export default mongoose.model("signup", signup);
