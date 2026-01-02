"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SpeedInsights } from "@vercel/speed-insights/next"

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

	const onSignUp = async () => {
		try {
			setLoading(true);

			await axios.post("/api/users/signup", {
				username: user.username,
				email: user.email,
				password: user.password,
				confirmPassword: confirmPassword,
			});

			router.push("/login");
		} catch (error: any) {
			console.log("Signup error:", error.response?.data || error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (
			user.username &&
			user.email &&
			user.password &&
			confirmPassword &&
			user.password === confirmPassword
		) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user, confirmPassword]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
			<div className="bg-[#12172A] p-10 rounded-2xl w-[420px] shadow-xl border border-[#1F2440]">
				<h1 className="text-4xl font-bold text-white mb-2">
					{loading ? "Processing..." : "Create Account"}
				</h1>

				<p className="text-sm text-purple-400 mb-8">
					No credit card required
				</p>

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
						${
							buttonDisabled || loading
								? "bg-[#1F2440] text-gray-400 cursor-not-allowed"
								: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
						}`}
				>
					Register Account
				</button>

				<p className="text-gray-400 text-sm mt-6 text-center">
					Already have an account?
					<Link
						href="/login"
						className="text-purple-400 ml-1 font-semibold hover:underline"
					>
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
