'use client'
import { motion } from 'framer-motion'
import { Sparkles, Github, Twitter, Linkedin, Youtube } from 'lucide-react'
import Link from 'next/link'

const links = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
]

const socials = [
  { icon: Github, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Linkedin, href: '#' },
  { icon: Youtube, href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-6xl px-4"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
           
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
          </div>

          <nav className="flex items-center gap-7 text-sm text-white/60">
            {links.map((l) => (
              <motion.a
                key={l.label}
                href={l.href}
                whileHover={{ y: -2, color: '#fff' }}
                className="transition-colors"
              >
                {l.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socials.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.a
                  key={i}
                  href={s.href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="h-9 w-9 grid place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:shadow-[0_0_20px_rgba(96,165,250,0.4)] hover:border-blue-400/40 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              )
            })}
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/5 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Hire Byte. Crafted with care.
        </div>
      </motion.div>
    </footer>
  )
}