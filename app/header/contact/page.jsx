'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Header } from '@/components/inside/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/PaheHero'
import { FadeIn, Stagger, itemVariants } from '@/components/Motion'
import { Mail, MessageSquare, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const channels = [
  { icon: Mail, title: 'Email', value: 'hello@aijobportal.com', desc: 'We reply within a business day.' },
  { icon: MessageSquare, title: 'Live chat', value: 'Chat with us', desc: 'Mon–Fri, 9am – 6pm IST.' },
  { icon: Phone, title: 'Phone', value: '+1 (415) 555-0123', desc: 'For urgent enterprise issues.' },
]

const offices = [
  { city: 'Bengaluru', country: 'India', line: 'Indiranagar, 560038', tint: 'from-amber-500 to-orange-500' },
  { city: 'San Francisco', country: 'USA', line: 'Mission District, 94103', tint: 'from-blue-500 to-cyan-500' },
  { city: 'Berlin', country: 'Germany', line: 'Mitte, 10115', tint: 'from-violet-500 to-fuchsia-500' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function submit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 900)
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative min-h-screen bg-[#05060f] text-white selection:bg-blue-500/30">
      <Header />
      <PageHero
        eyebrow="Contact"
        title="Talk to the"
        highlight="humans behind the AI."
        description="Questions about pricing, partnerships or careers? We’d love to hear from you."
        accent="from-violet-600/30 to-cyan-600/30"
      />

      {/* Channels */}
  {/* Channels / Social Links */}
<section className="relative py-24"> {/* Increased padding from 10 to 24 */}
  <div className="mx-auto max-w-7xl px-6"> {/* Increased from max-6xl to 7xl to match form */}
    
    <FadeIn>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Connect with <span className="gradient-text">our channels</span>
        </h2>
        <p className="mt-4 text-white/60 max-w-2xl mx-auto">
          Choose the best way to reach us. Whether it's technical support or general inquiries, we're here.
        </p>
      </div>
    </FadeIn>

    <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Increased gap from 5 to 8 */}
      {channels.map((c) => {
        const Icon = c.icon
        return (
          <motion.div 
            key={c.title} 
            variants={itemVariants} 
            whileHover={{ y: -8, scale: 1.02 }} // Slightly more lift
            className="group gradient-border p-10 text-center rounded-2xl flex flex-col items-center" // Matched p-10 and rounded-2xl
          >
            {/* Icon Container with Glow effect */}
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-blue-300 group-hover:text-white group-hover:bg-blue-500/20 group-hover:border-blue-400/50 group-hover:shadow-[0_0_30px_rgba(96,165,250,0.3)] transition-all duration-500">
              <Icon className="h-7 w-7" />
            </div>

            <h3 className="mt-6 text-xl font-bold">{c.title}</h3>
            
            <div className="mt-2 text-sm gradient-text font-semibold uppercase tracking-wider">
              {c.value}
            </div>
            
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              {c.desc}
            </p>

            {/* Optional: Add a "Visit" link to make it feel more interactive */}
            <div className="mt-6 text-xs font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to open →
            </div>
          </motion.div>
        )
      })}
    </Stagger>
  </div>
</section>

      {/* Form + Offices */}
<section className="relative py-24">
  <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-start">

    {/* LEFT - FORM */}
    <FadeIn>
      <div className="gradient-border p-10 rounded-2xl">
        
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Let’s build something <span className="gradient-text">together</span>
        </h2>

        <p className="mt-3 text-white/60 text-sm md:text-base">
          Tell us what you’re working on — we usually respond within 24 hours.
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
          >
            <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-400" />
            <div className="mt-3 text-lg font-semibold">Message sent!</div>
            <p className="text-sm text-white/70 mt-1">
              We’ll get back to you soon.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">

            {/* Name + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 outline-none transition"
              />

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email address"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 outline-none transition"
              />
            </div>

            {/* Subject */}
            <div className="flex flex-wrap gap-2">
              {['General', 'Sales', 'Partnerships', 'Careers', 'Press'].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setForm({ ...form, subject: s })}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    form.subject === s
                      ? 'bg-blue-500/20 border-blue-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Message */}
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us about your idea..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 outline-none transition resize-none"
            />

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white py-6 text-base shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition"
            >
              {loading ? "Sending..." : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </FadeIn>

    {/* RIGHT - OFFICES */}
    <FadeIn delay={0.1}>
      <div className="gradient-border p-10 rounded-2xl h-full">

        <h3 className="text-2xl md:text-3xl font-bold">
          Global presence
        </h3>

        <p className="mt-2 text-white/60 text-sm">
          We work across continents with distributed teams.
        </p>

        <div className="mt-8 space-y-5">
          {offices.map((o) => (
            <motion.div
              key={o.city}
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${o.tint} grid place-items-center font-semibold`}>
                {o.city[0]}
              </div>

              <div>
                <div className="font-semibold text-base">
                  {o.city}, <span className="text-white/60 font-normal">{o.country}</span>
                </div>
                <div className="text-xs text-white/60">
                  {o.line}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </FadeIn>

  </div>
</section>

      <Footer />
    </motion.main>
  )
}