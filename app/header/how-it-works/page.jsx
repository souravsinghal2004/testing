'use client'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Header } from '@/components/inside/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/PaheHero'
import { Stagger, itemVariants } from '@/components/Motion'
import { Search, Clock, ArrowUpRight, Flame } from 'lucide-react'

const POSTS = [
  { slug: 'ace-the-ai-interview', title: 'How to ace an AI-led interview in 2025', excerpt: 'Five specific tactics our top candidates use to perform under the gaze of an adaptive AI interviewer.', category: 'Interviews', date: 'Jun 12, 2025', read: '7 min', tint: 'from-blue-500 to-cyan-500', featured: true },
  { slug: 'resume-that-converts', title: 'The resume format that doubled our users’ reply rate', excerpt: 'We analyzed 40,000 resumes. This is what actually gets recruiters to click “reply”.', category: 'Resume', date: 'Jun 06, 2025', read: '9 min', tint: 'from-violet-500 to-fuchsia-500' },
  { slug: 'remote-roles-rising', title: '12 remote-first roles rising fastest this quarter', excerpt: 'From AI PMs to ML ops engineers — the roles companies are paying a premium to fill.', category: 'Market', date: 'May 29, 2025', read: '6 min', tint: 'from-emerald-500 to-teal-500' },
  { slug: 'negotiation-playbook', title: 'The one-email negotiation playbook', excerpt: 'Copy-paste scripts that have pushed offers up by 15–35% for real AI Job Portal users.', category: 'Career', date: 'May 21, 2025', read: '5 min', tint: 'from-amber-500 to-orange-500' },
  { slug: 'portfolio-for-engineers', title: 'Your portfolio should look like a product', excerpt: 'The shift from GitHub-as-portfolio to portfolio-as-case-study — with examples from real hires.', category: 'Career', date: 'May 12, 2025', read: '8 min', tint: 'from-pink-500 to-rose-500' },
  { slug: 'behind-the-ai', title: 'Behind the AI: how our interviewer thinks', excerpt: 'A peek under the hood at the prompt-engineering and feedback loops that power our adaptive interviews.', category: 'Engineering', date: 'May 02, 2025', read: '11 min', tint: 'from-indigo-500 to-blue-500' },
]

const CATEGORIES = ['All', 'Interviews', 'Resume', 'Career', 'Market', 'Engineering']

export default function BlogPage() {
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')

  const featured = POSTS.find((p) => p.featured)
  const filtered = useMemo(() => POSTS.filter((p) => !p.featured)
    .filter((p) => cat === 'All' ? true : p.category === cat)
    .filter((p) => (p.title + p.excerpt).toLowerCase().includes(q.toLowerCase())), [cat, q])

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative min-h-screen bg-[#05060f] text-white selection:bg-blue-500/30">
      <Header />
       
      <PageHero
        eyebrow="Blog"
        title="Field notes on"
        highlight="hiring, careers & AI."
        description="Playbooks, deep-dives and data from the AI Job Portal team — written for job-seekers and the people who hire them."
        accent="from-cyan-600/30 to-violet-600/30"
      />

      {/* Featured */}
      {featured && (
        <section className="relative pb-4">
          <div className="mx-auto max-w-6xl px-4">
            <Link href={`/blog/${featured.slug}`}>
              <motion.article whileHover={{ y: -4, scale: 1.005 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }} className="group relative gradient-border overflow-hidden grid md:grid-cols-5">
                <div className={`relative md:col-span-2 min-h-[260px] bg-gradient-to-br ${featured.tint}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur px-3 py-1 text-xs border border-white/15">
                    <Flame className="h-3.5 w-3.5 text-amber-300" /> Featured
                  </div>
                </div>
                <div className="md:col-span-3 p-8 md:p-10">
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">{featured.category}</span>
                    <span>{featured.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.read}</span>
                  </div>
                  <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight leading-snug group-hover:gradient-text transition-colors">{featured.title}</h2>
                  <p className="mt-3 text-white/70">{featured.excerpt}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm text-blue-300 group-hover:text-white transition-colors">
                    Read article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </motion.article>
            </Link>
          </div>
        </section>
      )}

      {/* Filters + Search */}
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-xs border transition ${cat === c ? 'border-blue-400/60 bg-blue-500/15 text-white' : 'border-white/10 bg-white/5 text-white/70 hover:text-white'}`}>{c}</button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition" />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-6xl px-4">
          {filtered.length === 0 ? (
            <div className="gradient-border p-10 text-center text-white/70">
              No articles match “{q}” in <strong>{cat}</strong>. Try a different keyword.
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <motion.div key={p.slug} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }} className="group gradient-border overflow-hidden">
                  <Link href={`/blog/${p.slug}`} className="block">
                    <div className={`relative h-40 bg-gradient-to-br ${p.tint} overflow-hidden`}>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                      <span className="absolute top-3 left-3 rounded-full bg-black/40 backdrop-blur px-2.5 py-0.5 text-[10px] uppercase tracking-wider border border-white/15">{p.category}</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-white/55">
                        <span>{p.date}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:gradient-text transition-colors">{p.title}</h3>
                      <p className="mt-2 text-sm text-white/60 line-clamp-3">{p.excerpt}</p>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-blue-300 group-hover:text-white">
                        Read more <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="relative overflow-hidden rounded-3xl gradient-border p-10 text-center">
            <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.25),transparent_60%)]" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold">Get one actionable career insight every <span className="gradient-text">Sunday</span>.</h3>
              <p className="mt-2 text-white/60 text-sm">No spam. Unsubscribe anytime. 34,000+ readers.</p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input required type="email" placeholder="you@work.com" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20" />
                <button className="relative group overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 px-5 py-3 text-sm font-medium shadow-lg shadow-blue-500/30 transition-transform hover:scale-[1.03] active:scale-[0.97]">
                  <span className="relative z-10">Subscribe</span>
                  <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.main>
  )
}