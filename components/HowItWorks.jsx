'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { UserPlus, Target, Trophy } from 'lucide-react'

const steps = [
  { icon: UserPlus, title: 'Create Profile', desc: 'Sign up and import your resume. Our AI builds a rich profile in seconds.' },
  { icon: Target, title: 'Get Matched', desc: 'Receive curated jobs ranked by fit, with insights into what to improve.' },
  { icon: Trophy, title: 'Crack Interview', desc: 'Practice with adaptive AI and apply once you are interview-ready.' },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="how" ref={ref} className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm font-medium tracking-wider uppercase text-violet-400">How it works</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            Three steps to your <span className="gradient-text">next role</span>
          </h2>
        </div>

        <div className="relative mt-20">
          <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              style={{ originX: 0 }}
              className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.2 }}
                  className="relative text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 250 }}
                    className="relative mx-auto h-20 w-20 rounded-2xl glass grid place-items-center glow-blue"
                  >
                    <Icon className="h-8 w-8 text-blue-300" />
                    <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold grid place-items-center">
                      {i + 1}
                    </span>
                  </motion.div>
                  <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-white/60 max-w-xs mx-auto">{s.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}