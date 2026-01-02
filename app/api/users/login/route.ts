import { connectToMongoDB } from "@/Config/dbConfig";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectToMongoDB();

export async function POST(request: Request) {
	try {
		if (!process.env.TOKEN_SECRET) {
			return NextResponse.json(
				{ error: "Server misconfiguration" },
				{ status: 500 }
			);
		}

		const { identifier, password } = await request.json();

		if (!identifier || !password) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		// 🔍 Step 1: Check account exists or not
		const user = await User.findOne({
			$or: [{ email: identifier }, { username: identifier }],
		}).select("+password");

		// ❌ Case 3: Account does not exist
		if (!user) {
			return NextResponse.json(
				{
					error:
						"Account does not exist. Please sign up first.",
				},
				{ status: 404 }
			);
		}

		// 🔑 Step 2: Check password
		const isValid = await bcryptjs.compare(
			password,
			user.password
		);

		// ❌ Case 2: Wrong password
		if (!isValid) {
			return NextResponse.json(
				{ error: "Incorrect password" },
				{ status: 401 }
			);
		}

		// ✅ Case 1: Login success
		const token = jwt.sign(
			{ sub: user._id.toString() },
			process.env.TOKEN_SECRET,
			{ expiresIn: "2d" }
		);

		const response = NextResponse.json({
			success: true,
			message: "Login successful",
		});

		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 2,
		});

		return response;
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
