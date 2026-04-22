'use client'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      // Updated to match the "Glass" look of your dashboard header
      className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center bg-black/10 backdrop-blur-md border-b border-white/5"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        
        {/* --- LOGO (Now Flex instead of Absolute for better alignment) --- */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-gray-950 border border-white/10 group-hover:border-blue-500/40 transition-colors duration-300">
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

        {/* --- CENTER NAV (Standardized spacing) --- */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#how" className="hover:text-blue-400 transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-blue-400 transition-colors">Stories</a>
        </nav>

        {/* --- RIGHT ACTIONS --- */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex text-white/70 hover:text-white hover:bg-white/5">
            Sign in
          </Button>
          <Button className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white shadow-xl shadow-blue-500/20 border-0 px-6">
           <Link href="/auth-redirect">
    <span className="relative z-10 flex items-center gap-2">
      Get Started
     
    </span>
    <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
  </Link>
          </Button>
        </div>

      </div>
    </motion.header>
  )
}