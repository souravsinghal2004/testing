"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import InterviewButton from "./InterviewButton";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function JobDetailsClient({ job }) {
  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 selection:bg-blue-500/40 pb-20 overflow-x-hidden">
      
      {/* 🌌 Atmospheric Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full" />
        {/* Large Background Text for Design depth */}
        <div className="absolute top-20 left-10 text-[15rem] font-bold text-white/[0.02] select-none pointer-events-none uppercase">
          {job.jobType}
        </div>
      </div>

      <motion.main 
        initial="initial" 
        animate="animate" 
        variants={stagger}
        className="relative z-10 max-w-5xl mx-auto px-6 pt-16"
      >
        {/* 🔙 Breadcrumb */}
        <motion.div variants={fadeInUp} className="mb-10">
          <Link href="/login" className="text-sm font-mono text-blue-500 hover:text-blue-300 transition-colors tracking-tighter">
            &lt; RETURN_TO_LIST /&gt;
          </Link>
        </motion.div>

        {/* 👑 Hero Header */}
        <header className="mb-20">
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase italic">
                {job.workMode?.replace(/_/g, " ")}
              </span>
              <span className="text-slate-500 text-xs font-mono tracking-widest">{job.jobId}</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 uppercase leading-[0.9]">
              {job.title}<span className="text-blue-600">.</span>
            </h1>
            <div className="flex flex-wrap items-end gap-10">
              <p className="text-2xl text-slate-400 font-light italic">@{job.company}</p>
              <div className="h-px w-20 bg-slate-800 mb-3 hidden md:block" />
              <p className="text-sm text-slate-500 uppercase tracking-[0.3em] mb-1">{job.location}, India</p>
            </div>
          </motion.div>
        </header>

        {/* ⚡ Quick Stats Grid (Border-less) */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-12 py-12 border-y border-white/5 mb-24">
          {[
            { label: "Duration", val: job.duration },
            { label: "Stipend", val: `₹${job.stipend?.min} - ${job.stipend?.max}` },
            { label: "Applicants", val: `${job.applicants}+` },
            { label: "Apply By", val: new Date(job.applyBy).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-xl text-white font-medium">{stat.val}</p>
            </div>
          ))}
        </motion.div>

        {/* 📖 Content Blocks */}
        <div className="grid lg:grid-cols-12 gap-20 py-20">
          <div className="lg:col-span-8 space-y-24">
            
            {/* About Section */}
            <motion.section variants={fadeInUp}>
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-8 italic">// MISSION_BRIEF</h2>
              <p className="text-2xl text-slate-300 leading-relaxed font-light">
                {job.about}
              </p>
            </motion.section>

            {/* Responsibilities with Custom Bullets */}
            <motion.section variants={fadeInUp}>
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-10 italic">// EXECUTION_TASKS</h2>
              <div className="grid md:grid-cols-1 gap-6">
                {job.responsibilities.map((task, i) => (
                  <div key={i} className="group flex gap-6 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <span className="text-blue-600 font-black text-xl italic opacity-50">0{i+1}</span>
                    <p className="text-slate-300 text-lg group-hover:text-white transition-colors">{task}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-16">
            
            {/* Benefits - Glassmorphism touch */}
            <motion.section variants={fadeInUp} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">Perks & Benefits</h3>
              <ul className="space-y-4">
                {job.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Good to Have */}
            <motion.section variants={fadeInUp} className="pl-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 italic">Bonus Points</h3>
              <ul className="space-y-4">
                {job.goodToHave.map((item, i) => (
                  <li key={i} className="text-sm text-slate-400 font-light border-l border-slate-800 pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Skills */}
            <motion.section variants={fadeInUp}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 italic">Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="text-[10px] font-bold border border-slate-800 px-3 py-1 rounded-full text-slate-500 uppercase">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.section>
          </aside>
        </div>

    

        {/* 🚀 Floating Bottom Bar */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50"
        >
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full p-4 pl-10 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="hidden md:block">
              <p className="text-white font-bold text-sm tracking-tight">{job.title}</p>
              <p className="text-slate-500 text-[10px] uppercase font-mono tracking-tighter">Ready for assessment?</p>
            </div>
            <InterviewButton job={job} />
          </div>
        </motion.div>

      </motion.main>
    </div>
  );
}