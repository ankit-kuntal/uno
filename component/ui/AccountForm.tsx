"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaAngleLeft } from "react-icons/fa6";

export default function AccountForm() {
	const router = useRouter();

	const [user, setUser] = React.useState({
		username: "",
		email: "",
		password: "",
	});

	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [buttonDisabled, setButtonDisabled] = React.useState(true);
	const [loading, setLoading] = React.useState(false);

	const onSignUp = async () => {
		try {
			setLoading(true);
			await axios.post("/api/users/signup", user);
			router.push("/login");
		} catch (error: any) {
			console.log(error.message);
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
					{loading ? "Processing..." : "Free Sign Up"}
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
					disabled={buttonDisabled}
					className={`w-full py-3 rounded-lg font-bold transition
						${
							buttonDisabled
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

				<Link
					href="/"
					className="block text-center mt-6 text-gray-500 hover:text-purple-400"
				>
					<FaAngleLeft className="inline mr-1" />
					Back to homepage
				</Link>
			</div>
		</div>
	);
}
