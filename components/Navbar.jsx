"use client";

import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
export function Header() {
  return (
    <header className="w-full flex items-center justify-between px-10 py-6  bg-gradient-to-br from-black via-[#0f172a] to-blue-900  text-white">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-red-500 rounded-md"></div>
        <h1 className="text-xl font-semibold">INTERVIEW</h1>
      </div>

      {/* Links */}
      <nav className="hidden md:flex items-center gap-8 text-white">
        <a href="#">Solutions</a>
        <a href="#">Enterprise</a>
        <a href="#">Resources</a>
        <a href="#">Pricing</a>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">

        {/* USER NOT SIGNED IN */}
       <SignedOut>
  <Link
    href="/sign-in"
    className="text-white hover:text-gray-300 font-medium"
  >
    Sign In
  </Link>
</SignedOut>

        {/* USER SIGNED IN */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

      </div>

    </header>
  );
}