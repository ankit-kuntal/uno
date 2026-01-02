import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getAuthUser() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	if (!token || !process.env.TOKEN_SECRET) {
		return null;
	}

	try {
		return jwt.verify(token, process.env.TOKEN_SECRET) as {
			sub: string;
		};
	} catch {
		return null;
	}
}
