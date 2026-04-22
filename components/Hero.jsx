'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
const phrases = ['AI-Powered Interviews', 'Smart Job Matching', 'Instant Skill Feedback']

export default function Hero() {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    const current = phrases[idx % phrases.length]
    const speed = del ? 40 : 70
    const t = setTimeout(() => {
      if (!del) {
        setText(current.slice(0, text.length + 1))
        if (text.length + 1 === current.length) setTimeout(() => setDel(true), 1500)
      } else {
        setText(current.slice(0, text.length - 1))
        if (text.length - 1 === 0) { setDel(false); setIdx(idx + 1) }
      }
    }, speed)
    return () => clearTimeout(t)
  }, [text, del, idx])

  // cursor parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 20 })
  const sy = useSpring(my, { stiffness: 40, damping: 20 })
  const tx1 = useTransform(sx, (v) => v * 30)
  const ty1 = useTransform(sy, (v) => v * 30)
  const tx2 = useTransform(sx, (v) => v * -40)
  const ty2 = useTransform(sy, (v) => v * -40)

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) - 0.5)
    my.set(((e.clientY - rect.top) / rect.height) - 0.5)
  }

  return (
    <section onMouseMove={onMove} className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 grid-bg" />

      <motion.div style={{ x: tx1, y: ty1 }} className="absolute -top-32 -left-20 h-[480px] w-[480px] rounded-full bg-blue-600/30 blur-3xl float-slow" />
      <motion.div style={{ x: tx2, y: ty2 }} className="absolute -bottom-20 -right-24 h-[520px] w-[520px] rounded-full bg-violet-600/30 blur-3xl float-slower" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[320px] w-[320px] rounded-full bg-cyan-500/20 blur-3xl float-slow" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>Introducing AI interviews, now free for students</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-6 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Get Hired Faster with
          <br className="hidden md:block" />
          <span className="gradient-text">{text}</span>
          <span className="inline-block w-[3px] h-[0.9em] align-[-0.12em] ml-1 bg-blue-400 animate-pulse" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
        >
         Connect with AI-powered real interviews, receive instant skill-level feedback, and land opportunities at companies that match your profile — all in one seamless platform.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } } }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
           <Button
  asChild
  size="lg"
  className="relative group overflow-hidden bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white px-8 py-6 text-base shadow-2xl shadow-blue-500/30 transition-transform active:scale-[0.97] hover:scale-[1.04]"
>
  <Link href="/auth-redirect">
    <span className="relative z-10 flex items-center gap-2">
      Get Started
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </span>
    <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
  </Link>
</Button>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
            <Button
              size="lg"
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-base backdrop-blur-sm transition-transform active:scale-[0.97] hover:scale-[1.04]"
            >
              <Play className="h-4 w-4 mr-2" /> Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 text-center"
        >
          {[
            ['120K+', 'AI Interviews'],
            ['4.9/5', 'Candidate Rating'],
            ['3.2x', 'Faster Hires'],
          ].map(([k, v]) => (
            <div key={v} className="glass rounded-xl py-5">
              <div className="text-2xl font-semibold gradient-text">{k}</div>
              <div className="text-xs uppercase tracking-wider text-white/60 mt-1">{v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
