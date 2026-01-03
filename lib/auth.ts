import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type AuthPayload = {
  sub: string;      // user _id
  username: string;
};

export async function getAuthUser(): Promise<AuthPayload | null> {
  const token = (await cookies()).get("token")?.value;

  if (!token || !process.env.TOKEN_SECRET) return null;

  try {
    return jwt.verify(token, process.env.TOKEN_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}
