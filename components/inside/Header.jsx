"use client";

import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    // Removed the gradient here, added backdrop-blur and a subtle bottom border
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-10 h-20 bg-black/10 backdrop-blur-md border-b border-white/5 text-white">

      {/* --- LOGO WRAPPER --- */}
      <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
        <div className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-blue-500/40 transition-colors duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
          <span className="relative text-2xl font-extrabold text-white leading-none tracking-tight">
            H
            <span className="absolute -bottom-1 right-0 h-1 w-3 bg-blue-400 rounded-full group-hover:bg-violet-400 transition-colors" />
          </span>
        </div>

        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-bold text-white tracking-tight">Hire</span>
          <span className="text-xl font-light text-white/70 tracking-tight">Byte</span>
        </div>
      </Link>

      {/* --- NAV LINKS --- */}
      <nav className="hidden md:flex items-center gap-8 text-white/70">
        {["Home", "About", "Contact", "Blogs"].map((item) => (
          <Link 
            key={item}
            href={item === "Home" ? "/" : `/header/${item.toLowerCase().replace(' ', '-')}`}
            className="text-sm font-medium transition-all hover:text-blue-400"
          >
            {item}
          </Link>
        ))}
      </nav>

      {/* --- AUTH --- */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}
 