import { Suspense } from "react";
import OTPClient from "./OtpClient";

export default function OTPVerifyPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <OTPClient />
    </Suspense>
  );
}
