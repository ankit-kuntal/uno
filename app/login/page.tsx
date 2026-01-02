"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
	const router = useRouter();

	const [user, setUser] = useState({
		identifier: "",
		password: "",
	});

	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(""); // ✅ NEW

	const onLogin = async () => {
		try {
			setLoading(true);
			setError(""); // clear old error

			const response = await axios.post("/api/users/login", {
				identifier: user.identifier,
				password: user.password,
			});

			router.push("/dashboard");
		} catch (err: any) {
			// ✅ BACKEND MESSAGE DIRECTLY USER KO
			const message =
				err.response?.data?.error ||
				"Something went wrong. Please try again.";

			setError(message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setButtonDisabled(!(user.identifier && user.password));
	}, [user]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
			<div className="bg-[#12172A] p-10 rounded-2xl w-[420px] shadow-xl border border-[#1F2440]">
				<h1 className="text-4xl font-bold text-white mb-2">
					{loading ? "We're logging you in..." : "Account Login"}
				</h1>

				<p className="text-sm text-purple-400 mb-6">
					Login using username or email
				</p>

				{/* 🔴 ERROR MESSAGE */}
				{error && (
					<div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-400 text-sm">
						{error}
					</div>
				)}

				<input
					type="text"
					className="w-full p-3 mb-4 rounded-lg bg-[#0B0F1A] text-white border border-[#1F2440] focus:border-purple-500 focus:outline-none"
					placeholder="Username or Email"
					value={user.identifier}
					onChange={(e) =>
						setUser({ ...user, identifier: e.target.value })
					}
				/>

				<input
					type="password"
					className="w-full p-3 mb-6 rounded-lg bg-[#0B0F1A] text-white border border-[#1F2440] focus:border-purple-500 focus:outline-none"
					placeholder="Password"
					value={user.password}
					onChange={(e) =>
						setUser({ ...user, password: e.target.value })
					}
				/>

				<button
					onClick={onLogin}
					disabled={buttonDisabled || loading}
					className={`w-full py-3 rounded-lg font-bold transition
						${
							buttonDisabled || loading
								? "bg-[#1F2440] text-gray-400 cursor-not-allowed"
								: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
						}`}
				>
					Login
				</button>

				{/* 👉 SIGNUP HINT WHEN ACCOUNT DOES NOT EXIST */}
				
					<p className="text-sm text-center mt-4 text-gray-400">
						Don’t have an account?
						<Link
							href="/signup"
							className="text-purple-400 ml-1 font-semibold hover:underline"
						>
							Create one
						</Link>
					</p>
				
			</div>
		</div>
	);
}
