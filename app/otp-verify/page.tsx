"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!email) {
    router.push("/signup");
    return null;
  }

  const verifyOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/users/verify-otp", { email, otp });

      if (res.data.success) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
      <div className="bg-[#12172A] p-10 rounded-2xl w-[420px]">
        <h1 className="text-3xl font-bold text-white mb-4">Verify OTP</h1>

        <p className="text-sm text-purple-400 mb-4">
          OTP sent to: <b>{email}</b>
        </p>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input"
        />

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <button onClick={verifyOTP} disabled={loading} className="btn">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
