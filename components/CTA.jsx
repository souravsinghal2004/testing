'use client'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-border p-10 md:p-16 text-center">
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.35),transparent_55%)]"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(167,139,250,0.3),transparent_60%)]"
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" /> It only takes 60 seconds
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]"
            >
              Start Your <span className="gradient-text">AI Interview</span>
              <br /> Journey Today
            </motion.h2>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Join thousands of candidates landing interviews at top companies — for free.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="relative group overflow-hidden bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white px-10 py-7 text-base shadow-2xl shadow-blue-500/40 transition-transform active:scale-[0.97] hover:scale-[1.05]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white px-8 py-7 text-base">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}