import { connectToMongoDB } from "@/Config/dbConfig";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connectToMongoDB();

export async function POST(request: NextRequest) {
	try {
		// 1️⃣ Get request body
		const reqBody = await request.json();
		const { username, email, password, confirmPassword } = reqBody;

		// 2️⃣ Validation
		if (!username || !email || !password || !confirmPassword) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		if (password !== confirmPassword) {
			return NextResponse.json(
				{ error: "Passwords do not match" },
				{ status: 400 }
			);
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: "Password must be at least 6 characters" },
				{ status: 400 }
			);
		}

		// 3️⃣ Check if username OR email already exists
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Username or email already exists" },
				{ status: 400 }
			);
		}

		// 4️⃣ Hash password
		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		// 5️⃣ Create new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		await newUser.save();

		// 6️⃣ Success response
		return NextResponse.json({
			message: "User registered successfully",
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
