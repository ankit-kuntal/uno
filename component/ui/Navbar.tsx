"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Logo from "./Logo";

type MobileNavProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => void;
};

function MobileNav({ open, setOpen, onLogout }: MobileNavProps) {
  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen w-full bg-[#0B0F1A] transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      {/* Header with Back Button and Logo */}
      <div className="flex items-center justify-start h-20 px-4 border-b border-[#1F2440]">
        {/* Back Button */}
        <button
          onClick={() => setOpen(false)}
          className="text-gray-300 hover:text-purple-400 transition mr-4"
        >
          {/* Simple left arrow SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Logo stays as before */}
        <Logo />
      </div>

      {/* Logout Button */}
      <div className="flex flex-col px-6 pt-8">
        <button
          onClick={onLogout}
          className="text-left text-lg font-medium py-4 text-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      router.push("/login");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full h-20 bg-[#0B0F1A] border-b border-[#1F2440] px-6 flex items-center justify-between">
      {/* Logo */}
      <Logo />

      {/* Desktop Logout */}
      <div className="hidden md:flex items-center">
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile Hamburger */}
      <div
        className="md:hidden flex flex-col justify-between w-8 h-6 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`h-1 w-full bg-white rounded transition-transform ${
            open ? "rotate-45 translate-y-2.5" : ""
          }`}
        />
        <span
          className={`h-1 w-full bg-white rounded transition-opacity ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-1 w-full bg-white rounded transition-transform ${
            open ? "-rotate-45 -translate-y-2.5" : ""
          }`}
        />
      </div>

      {/* Mobile Menu */}
      <MobileNav open={open} setOpen={setOpen} onLogout={onLogout} />
    </nav>
  );
}
