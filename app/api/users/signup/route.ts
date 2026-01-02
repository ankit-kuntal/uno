import { NextRequest, NextResponse } from "next/server";
import { generateOTP, sendOTPEmail, otpStore } from "@/lib/otp";

export async function POST(req: NextRequest) {
  const { username, email, password, confirmPassword } = await req.json();

  if (!username || !email || !password || !confirmPassword) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
  }

  const otp = generateOTP();

  otpStore.set(email, {
    otp,
    username,
    password,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
  });

  await sendOTPEmail(email, otp);

  return NextResponse.json({ message: "OTP sent to email" });
}
