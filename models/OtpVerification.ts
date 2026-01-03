// models/OtpVerification.ts
import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const OtpVerification =
  mongoose.models.OtpVerification ||
  mongoose.model("OtpVerification", otpVerificationSchema);

export default OtpVerification;
