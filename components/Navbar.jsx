"use client";

import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
export function Header() {
  return (
  
    <header className="relative w-full flex items-center justify-between px-10 h-20 bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">

      {/* 🔥 FLOATING LOGO */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 object-contain mix-blend-lighten">
        <img
          src="/hirebyte-logo.png"
          alt="HireByte Logo"
          className="h-14 w-auto object-contain mix-blend-lighten"
        />
      </div>

      {/* 🔥 NAV LINKS (center shift due to absolute logo) */}
      <nav className="hidden md:flex items-center gap-8 text-white mx-auto">
        <Link href="/">Home</Link>
        <Link href="/header/about">About</Link>
        <Link href="/header/how-it-works">How It Works</Link>
        <Link href="/header/contact">Contact</Link>
        <Link href="/header/pricing">Pricing</Link>
      </nav>

      {/* 🔥 AUTH */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <Link href="/sign-in" className="text-white hover:text-gray-300 font-medium">
            Sign In
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}
 