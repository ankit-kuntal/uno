import nodemailer from "nodemailer";

type OTPData = {
  otp: string;
  username: string;
  password: string;
  expiresAt: number;
};

export const otpStore = new Map<string, OTPData>();

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Signup OTP",
    text: `Your OTP is: ${otp}`,
  });
}
