'use client'
import { motion } from 'framer-motion'

export default function PageHero({ eyebrow, title, highlight, description, accent = 'from-blue-600/30 to-violet-600/30' }) {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 grid-bg" />
      <div className={`absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-gradient-to-br ${accent} blur-3xl float-slow opacity-70`} />
      <div className={`absolute -bottom-24 -right-24 h-[460px] w-[460px] rounded-full bg-gradient-to-br ${accent} blur-3xl float-slower opacity-60`} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {eyebrow && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-sm font-medium tracking-wider uppercase text-blue-400">
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]"
        >
          {title} {highlight && <span className="gradient-text">{highlight}</span>}
        </motion.h1>
        {description && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
            {description}
          </motion.p>
        )}
      </div>
    </section>
  )
}