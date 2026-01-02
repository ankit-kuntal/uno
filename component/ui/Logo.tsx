

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="flex items-center flex-shrink-0">
      <Link href="/">
        <div className="relative h-10 w-36 sm:w-36">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </Link>
    </div>
  );
}
