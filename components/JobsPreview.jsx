'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Building2, MapPin, Briefcase, ArrowUpRight } from 'lucide-react'
import { Stagger, itemVariants } from './Motion'
import { Button } from '@/components/ui/button'

const jobs = [
  { title: 'Frontend Engineer', company: 'Stripe', location: 'Remote', stipend: '$110k–$150k', skills: ['React', 'TypeScript', 'Tailwind'], accent: 'from-blue-500/30 to-cyan-500/20' },
  { title: 'ML Research Intern', company: 'Anthropic', location: 'San Francisco', stipend: '$9,200/mo', skills: ['PyTorch', 'LLMs', 'Python'], accent: 'from-violet-500/30 to-fuchsia-500/20' },
  { title: 'Product Designer', company: 'Linear', location: 'Remote', stipend: '$120k–$160k', skills: ['Figma', 'Motion', 'UX'], accent: 'from-emerald-500/30 to-teal-500/20' },
  { title: 'Backend Engineer', company: 'Vercel', location: 'Hybrid · NYC', stipend: '$140k–$180k', skills: ['Node.js', 'Go', 'AWS'], accent: 'from-amber-500/30 to-orange-500/20' },
  { title: 'Data Scientist', company: 'OpenAI', location: 'Remote', stipend: '$160k–$210k', skills: ['SQL', 'Python', 'Statistics'], accent: 'from-pink-500/30 to-rose-500/20' },
  { title: 'DevRel Engineer', company: 'Supabase', location: 'Remote', stipend: '$100k–$140k', skills: ['Content', 'Node.js', 'DB'], accent: 'from-indigo-500/30 to-blue-500/20' },
]

export default function JobsPreview() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t) }, [])

  return (
    <section id="jobs" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-wider uppercase text-cyan-400">Open roles</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              Fresh jobs <span className="gradient-text">matched for you</span>
            </h2>
          </div>
          <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            View all <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="relative gradient-border p-6 h-52 overflow-hidden shimmer">
                <div className="h-4 w-2/3 bg-white/10 rounded mb-4" />
                <div className="h-3 w-1/3 bg-white/10 rounded mb-6" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-white/10 rounded-full" />
                  <div className="h-6 w-20 bg-white/10 rounded-full" />
                  <div className="h-6 w-14 bg-white/10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Stagger className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <motion.div
                key={job.title + job.company}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                className="group relative gradient-border p-6 overflow-hidden cursor-pointer"
              >
                <div className={`absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br ${job.accent} blur-2xl opacity-40 group-hover:opacity-90 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Building2 className="h-4 w-4" /> {job.company}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-snug">{job.title}</h3>
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.stipend}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <span key={s} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}