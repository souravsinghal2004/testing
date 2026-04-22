'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Quote, Star } from 'lucide-react'

const data = [
  { quote: 'The AI interviews were indistinguishable from real ones. I walked into my Google interview calm and prepared.', name: 'Priya Sharma', role: 'SWE at Google', avatar: 'PS', tint: 'from-blue-500 to-cyan-500' },
  { quote: 'Got 4 offers in 6 weeks. The resume optimizer alone was worth it — it doubled my reply rate.', name: 'Marcus Chen', role: 'Data Scientist at Netflix', avatar: 'MC', tint: 'from-violet-500 to-fuchsia-500' },
  { quote: 'Genuinely felt like I had a senior mentor on call. The skill feedback is specific, kind and honest.', name: 'Aisha Patel', role: 'Product Designer at Linear', avatar: 'AP', tint: 'from-emerald-500 to-teal-500' },
]

export default function Testimonials() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % data.length), 5500); return () => clearInterval(t) }, [])
  const t = data[i]

  return (
    <section id="testimonials" className="relative py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="text-sm font-medium tracking-wider uppercase text-violet-400">Loved by candidates</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
          Stories from <span className="gradient-text">people like you</span>
        </h2>

        <div className="relative mt-14 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02 }}
              className="relative mx-auto max-w-3xl gradient-border p-10 text-left"
            >
              <Quote className="absolute top-6 right-6 h-10 w-10 text-white/10" />
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-4 w-4 fill-amber-400" />)}
              </div>
              <p className="mt-5 text-xl md:text-2xl leading-relaxed text-white/90 font-medium">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${t.tint} grid place-items-center font-semibold text-white shadow-lg`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-white/60">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-2">
            {data.map((_, idx) => (
              <button
                key={idx}
                aria-label={`testimonial ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2 rounded-full transition-all ${i === idx ? 'w-8 bg-gradient-to-r from-blue-400 to-violet-400' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}