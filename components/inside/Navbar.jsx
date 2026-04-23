"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/header/about" },
  { name: "Contact", href: "/header/contact" },
  { name: "Blogs", href: "/header/blogs" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      {/* Glass effect container */}
      <div className="mx-auto max-w-6xl mt-4 px-6">
        <div className="flex items-center justify-between px-6 py-3 rounded-full
                        bg-white/10 backdrop-blur-xl border border-white/20
                        shadow-lg">
          
          {/* Logo */}
          <div className="font-semibold text-white tracking-wide">
            MyApp
          </div>

          {/* Links */}
          <div className="flex items-center gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm text-white/80 hover:text-white transition"
                >
                  {link.name}

                  {/* Active / Hover pill animation */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-full bg-white/20"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Hover effect (Apple smooth fade) */}
                  <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}