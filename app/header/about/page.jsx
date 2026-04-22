'use client'
import { motion } from 'framer-motion'
import { Header } from '@/components/inside/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/PaheHero'

import { Stagger, itemVariants, FadeIn } from '@/components/Motion'
import { Rocket, Heart, Shield, Globe2, Users, Sparkles } from 'lucide-react'

const values = [
  { icon: Heart, title: 'Candidate-first', desc: 'Every decision starts with the person looking for their next role — not the recruiter.' },
  { icon: Shield, title: 'Honest feedback', desc: 'We build AI that tells the truth kindly, so you grow faster than you would alone.' },
  { icon: Rocket, title: 'Ship quickly', desc: 'We release improvements weekly, informed by real candidate outcomes.' },
  { icon: Globe2, title: 'Global by default', desc: 'From Bengaluru to Berlin, our interviews are designed for every culture and language.' },
]

const team = [
  {
    name: "Sourav Singhal",
    role: "B.Sc Computer Science (Hons) Student",
    tint: "from-blue-500 to-cyan-500",
    initials: "SS",
  },
  {
    name: "Shivam Kumar",
    role: "B.Sc Computer Science (Hons) Student",
    tint: "from-violet-500 to-fuchsia-500",
    initials: "SK",
  },
  {
    name: "Sachin Kumar",
    role: "B.Sc Computer Science (Hons) Student",
    tint: "from-emerald-500 to-teal-500",
    initials: "SA",
  },
  {
    name: "AI Job Portal Team",
    role: "Student Builder Group",
    tint: "from-amber-500 to-orange-500",
    initials: "AI",
  },
]

export default function AboutPage() {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative min-h-screen bg-[#05060f] text-white selection:bg-blue-500/30">
      <Header />
      <PageHero
        eyebrow="About us"
        title="We’re building the"
        highlight="fairest hiring layer on the internet."
        description="AI Job Portal was born out of a simple belief: the right person for the job is often hidden by the wrong process. We’re fixing that with thoughtful AI."
      />

      {/* Mission */}
      <section className="relative py-20">
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-10 items-center">
          <FadeIn>
            <div className="gradient-border p-8">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-blue-400"><Sparkles className="h-3.5 w-3.5" /> Our mission</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Make great work <span className="gradient-text">findable</span>.</h2>
              <p className="mt-4 text-white/70 leading-relaxed">
                Most hiring pipelines reward pedigree and guesswork. We use AI to reward signal — the
                actual skill and curiosity a person brings — and to give candidates preparation that
                used to be reserved for the lucky few.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {[['120K+','Interviews run'],['98%','Positive feedback'],['42','Countries'],['3.2x','Faster hires']].map(([k,v]) => (
                <div key={v} className="glass rounded-2xl p-6">
                  <div className="text-3xl font-semibold gradient-text">{k}</div>
                  <div className="text-xs uppercase tracking-wider text-white/60 mt-1">{v}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-medium tracking-wider uppercase text-violet-400">What we believe</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">Values that shape <span className="gradient-text">every release</span></h2>
          </div>
          <Stagger className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <motion.div key={v.title} variants={itemVariants} whileHover={{ y: -6, scale: 1.03 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} className="group relative gradient-border p-6 overflow-hidden">
                  <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/20 blur-2xl opacity-50 group-hover:opacity-90 transition-opacity" />
                  <div className="relative z-10">
                    <motion.div whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.6 }} className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-300">
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-white/60 leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </Stagger>
        </div>
      </section>

      {/* Team */}
{/* Team */}
<section className="relative py-28">
  <div className="mx-auto max-w-7xl px-6">
    
    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto">
      <p className="text-sm font-medium tracking-wider uppercase text-cyan-400 flex items-center justify-center gap-2">
        <Users className="h-4 w-4" /> The team
      </p>

      <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
        Small team. <span className="gradient-text">Big craft.</span>
      </h2>

      <p className="mt-4 text-white/60 text-base md:text-lg">
        Built by Computer Science students focused on solving real hiring problems using AI.
      </p>
    </div>

    {/* Cards */}
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {team.map((p) => (
        <motion.div
          key={p.name}
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
          className="group relative gradient-border p-8 rounded-2xl overflow-hidden flex items-center gap-6"
        >
          
          {/* Glow background */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/20 blur-3xl opacity-40 group-hover:opacity-80 transition" />

          {/* Avatar */}
          <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${p.tint} flex items-center justify-center text-xl font-bold shadow-lg shrink-0`}>
            {p.initials}
          </div>

          {/* Info */}
          <div className="relative z-10">
            <h3 className="text-xl font-semibold">{p.name}</h3>
            
            <p className="text-sm text-white/60 mt-1">
              {p.role}
            </p>

            {/* extra description */}
            <p className="text-sm text-white/40 mt-3 leading-relaxed max-w-md">
              Passionate about building real-world AI systems, full-stack web apps, and scalable products.
            </p>
          </div>
        </motion.div>
      ))}

    </div>
  </div>
</section>

      <Footer />
    </motion.main>
  )
}