import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/Config/dbConfig";
import User from "@/models/User";
import OtpVerification from "@/models/OtpVerification";
import bcrypt from "bcryptjs";
import { sendOTPEmail, generateOTP } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { username, email, password } = body;

    // 1️⃣ Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    username = username.trim();
    email = email.toLowerCase().trim();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // 2️⃣ Check real user
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 3️⃣ Remove old OTP (resend case)
    await OtpVerification.deleteOne({ email });

    // 4️⃣ Generate OTP + hash data
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Save TEMP record
    await OtpVerification.create({
      username,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // 6️⃣ Send email
    await sendOTPEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (error) {
    console.error("Signup OTP Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
