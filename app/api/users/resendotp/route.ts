import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/Config/dbConfig";
import OtpVerification from "@/models/OtpVerification";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectToMongoDB();
    const normalizedEmail = email.toLowerCase().trim();

    // 1️⃣ Check if OTP record exists
    const existingRecord = await OtpVerification.findOne({ email: normalizedEmail });

    if (!existingRecord) {
      return NextResponse.json(
        { error: "No signup session found. Please signup again." },
        { status: 400 }
      );
    }

    // 2️⃣ Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 3️⃣ Update record with new OTP and expiry
    existingRecord.otp = hashedOtp;
    existingRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await existingRecord.save();

    // 4️⃣ Send new OTP email
    await sendOTPEmail(normalizedEmail, otp);

    return NextResponse.json({
      success: true,
      message: "New OTP sent successfully!",
    });

  } catch (err: any) {
    console.error("Resend OTP Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
