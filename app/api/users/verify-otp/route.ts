import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToMongoDB } from "@/Config/dbConfig";

connectToMongoDB();

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // 1. validation
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // 2. user find
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 3. already verified
    if (user.isVerified) {
      return NextResponse.json(
        { message: "User already verified" },
        { status: 200 }
      );
    }

    // 4. otp check
    if (user.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // 5. otp expiry check
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // 6. mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        message: "OTP verified successfully",
        success: true,
      },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
