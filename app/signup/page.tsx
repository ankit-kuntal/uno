"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AccountForm() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ Show backend errors

  const onSignUp = async () => {
    try {
      setLoading(true);
      setError("");

      // Call signup API
      await axios.post("/api/users/signup", {
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword,
      });

      // ✅ Redirect to OTP verification page with email as query param
      router.push(`/otp-verify?email=${encodeURIComponent(user.email)}`);
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Enable button only when all fields are valid
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(user.email);

    const filled =
      user.username &&
      user.email &&
      isEmailValid &&
      user.password &&
      confirmPassword &&
      user.password === confirmPassword;

    setButtonDisabled(!filled);
  }, [user, confirmPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
      <div className="bg-[#12172A] p-10 rounded-2xl w-[420px] shadow-xl border border-[#1F2440]">
        <h1 className="text-4xl font-bold text-white mb-2">
          {loading ? "Processing..." : "Create Account"}
        </h1>

        <p className="text-sm text-purple-400 mb-6">
          No credit card required
        </p>

        {/* 🔴 ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-400 text-sm">
            {error}
          </div>
        )}

        <input
          className="w-full p-3 mb-4 rounded-lg bg-[#0B0F1A] text-white border border-[#1F2440] focus:border-purple-500 focus:outline-none"
          placeholder="Username"
          value={user.username}
          onChange={(e) =>
            setUser({ ...user, username: e.target.value })
          }
        />

        <input
          className="w-full p-3 mb-4 rounded-lg bg-[#0B0F1A] text-white border border-[#1F2440] focus:border-purple-500 focus:outline-none"
          placeholder="Email"
          value={user.email}
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full p-3 mb-4 rounded-lg bg-[#0B0F1A] text-white border border-[#1F2440] focus:border-purple-500 focus:outline-none"
          placeholder="Password"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full p-3 mb-6 rounded-lg bg-[#0B0F1A] text-white border border-[#1F2440] focus:border-purple-500 focus:outline-none"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button
          onClick={onSignUp}
          disabled={buttonDisabled || loading}
          className={`w-full py-3 rounded-lg font-bold transition
            ${buttonDisabled || loading
              ? "bg-[#1F2440] text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
            }`}
        >
          Register Account
        </button>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?
          <Link
            href="/otp-verify"
            className="text-purple-400 ml-1 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
