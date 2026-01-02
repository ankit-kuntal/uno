import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
	const token = (await cookies()).get("token")?.value;

	if (!token || !process.env.TOKEN_SECRET) {
		redirect("/login");
	}

	try {
		return jwt.verify(token, process.env.TOKEN_SECRET) as {
			sub: string;
		};
	} catch {
		redirect("/login");
	}
}
