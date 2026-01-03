"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function OTPClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // email must come from signup redirect

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Redirect to signup if email is missing
  useEffect(() => {
    if (!email) router.replace("/signup");
  }, [email, router]);

  // ✅ Verify OTP
  const verifyOTP = async () => {
    try {
      setLoading(true);
      setError("");

      if (!email) {
        setError("Session expired. Please signup again.");
        return;
      }

      const res = await axios.post("/api/users/verify-otp", { 
        email,  // send email
        otp,    // send otp
      });

      if (res.data.success) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP or Session Expired");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP
  const resendOTP = async () => {
    try {
      setResendLoading(true);
      setResendMessage("");

      if (!email) {
        setResendMessage("Session expired. Please signup again.");
        return;
      }

      const res = await axios.post("/api/users/resend-otp", { email });

      if (res.data.success) {
        setResendMessage("New OTP sent successfully!");
      }
    } catch (err: any) {
      setResendMessage(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
      <div className="bg-[#12172A] p-10 rounded-2xl w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-4">Verify OTP</h1>

        <p className="text-sm text-purple-400 mb-4">
          OTP sent to: <b>{email}</b>
        </p>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-[#1B1F33] text-white placeholder-gray-400 transition-colors"
        />

        {error && <p className="text-red-400 mb-3">{error}</p>}
        {resendMessage && <p className="text-green-400 mb-3">{resendMessage}</p>}

        {/* Verify OTP Button */}
        <button
          onClick={verifyOTP}
          disabled={loading || otp.length !== 6}
          className={`w-full p-3 mb-3 rounded-lg font-semibold transition-colors ${
            loading || otp.length !== 6
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend OTP Button */}
        <button
          onClick={resendOTP}
          disabled={resendLoading}
          className={`w-full p-3 rounded-lg font-semibold transition-colors ${
            resendLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          } text-white`}
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
