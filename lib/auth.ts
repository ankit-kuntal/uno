import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getAuthUser() {
	const cookieStore = cookies();
	const token = (await cookieStore).get("token")?.value;

	if (!token || !process.env.TOKEN_SECRET) return null;

	try {
		// Token me sub + username saved hai
		return jwt.verify(token, process.env.TOKEN_SECRET) as {
			sub: string;        // user _id
			username: string;   // username
		};
	} catch {
		return null;
	}
}
