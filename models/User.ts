// models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // username unique hoga
      trim: true,   // extra spaces remove ho jaayenge
    },
    email: {
      type: String,
      required: true,
      unique: true, // email unique hoga
      lowercase: true, // email hamesha lowercase store hoga
      trim: true,
    },
    password: {
      type: String,
      required: true, // unique remove kiya
    },
  },
  { timestamps: true } // createdAt & updatedAt automatically add ho jaayenge
);

// Agar model already exist karta hai to use karo, nahi to create karo
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
