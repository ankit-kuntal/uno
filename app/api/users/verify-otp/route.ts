import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/Config/dbConfig";
import User from "@/models/User";
import OtpVerification from "@/models/OtpVerification";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const normalizedEmail = email.toLowerCase().trim();

    // 1️⃣ Find OTP record
    const record = await OtpVerification.findOne({
      email: normalizedEmail,
    });

    if (!record) {
      return NextResponse.json(
        { error: "Session expired. Please signup again." },
        { status: 400 }
      );
    }

    // 2️⃣ Expiry check
    if (record.expiresAt < new Date()) {
      await OtpVerification.deleteOne({ email: normalizedEmail });
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // 3️⃣ OTP match
    const isOtpValid = await bcrypt.compare(
      otp.trim(),
      record.otp
    );

    if (!isOtpValid) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // 4️⃣ FINAL safety check (duplicate user)
    const alreadyUser = await User.findOne({
      email: normalizedEmail,
    });

    if (alreadyUser) {
      await OtpVerification.deleteOne({ email: normalizedEmail });
      return NextResponse.json(
        { error: "User already exists. Please login." },
        { status: 400 }
      );
    }

    // 5️⃣ Delete OTP FIRST (important)
    await OtpVerification.deleteOne({ email: normalizedEmail });

    // 6️⃣ Create user
    const newUser = await User.create({
      username: record.username,
      email: record.email,
      password: record.password, // already hashed
    });

    // 7️⃣ JWT token
    const token = jwt.sign(
      {
        sub: newUser._id.toString(),
        username: newUser.username,
      },
      process.env.TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Account verified successfully",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
