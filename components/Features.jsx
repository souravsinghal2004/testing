'use client'
import { motion } from 'framer-motion'
import { Brain, MessageSquare, LineChart, Cpu } from 'lucide-react'
import { Stagger, itemVariants } from './Motion'

const features = [
  { icon: Cpu, title: 'AI Job Matching', desc: 'Our model scores every opportunity against your skills, experience and aspirations.', color: 'from-blue-500/40 to-cyan-500/20' },
  { icon: MessageSquare, title: 'Smart Interview System', desc: 'Realistic voice + textless interviews with adaptive questions for the role you want.', color: 'from-violet-500/40 to-fuchsia-500/20' },
  { icon: LineChart, title: 'Skill Feedback', desc: 'Granular breakdowns on communication, problem-solving and technical depth.', color: 'from-emerald-500/40 to-teal-500/20' },
  {
  icon: Brain,
  title: 'Adaptive Intelligence',
  desc: 'Each interview dynamically adjusts difficulty and questions based on your responses.',
  color: 'from-purple-500/40 to-indigo-500/20'
}
]

export default function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-64 w-[60%] rounded-full bg-blue-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-sm font-medium tracking-wider uppercase text-blue-400">
            Features
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            Everything you need to <span className="gradient-text">land the offer</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-4 text-white/60">
            A thoughtfully designed toolkit that replaces five different apps.
          </motion.p>
        </div>

        <Stagger className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.03, rotateX: 2, rotateY: -2 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="group relative gradient-border p-6 overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={`absolute -top-24 -right-24 h-52 w-52 rounded-full bg-gradient-to-br ${f.color} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
                <div className="relative z-10">
                  <motion.div whileHover={{ rotate: [0, -8, 8, 0], y: -2 }} transition={{ duration: 0.6 }} className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-300 shadow-inner">
                    <Icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{f.desc}</p>
                </div>
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
                </div>
              </motion.div>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}