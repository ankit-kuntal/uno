import Image from "next/image";
import { redirect } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
	redirect("/login");

}

