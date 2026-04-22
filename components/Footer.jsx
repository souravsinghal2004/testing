'use client'
import { motion } from 'framer-motion'
import { Sparkles, Github, Twitter, Linkedin, Youtube } from 'lucide-react'

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
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 grid place-items-center glow-blue">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">AI Job <span className="gradient-text">Portal</span></span>
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
          © {new Date().getFullYear()} AI Job Portal. Crafted with care.
        </div>
      </motion.div>
    </footer>
  )
}