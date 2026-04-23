"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Play, ShieldCheck, Wifi, Cpu, AlertTriangle, Zap } from "lucide-react";

function InstructionsContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Technical Interview";
  const jobId = searchParams.get("jobId");

  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const instructions = [
    { icon: <Wifi className="w-5 h-5 text-blue-400" />, text: "Stable internet connection required", label: "Connectivity" },
    { icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, text: "Answer clearly & honestly", label: "Integrity" },
    { icon: <Cpu className="w-5 h-5 text-purple-400" />, text: "Technical + logical questions included", label: "Format" },
    { icon: <Zap className="w-5 h-5 text-yellow-400" />, text: "AI evaluates your responses real-time", label: "Assessment" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col min-h-screen"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <button
            onClick={() => router.back()}
            className="group flex items-center text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                {title}
              </h1>
              <p className="text-slate-400 mt-4 text-lg max-w-xl">
                Preparation is key. Ensure your environment is quiet and your equipment is functional before proceeding.
              </p>
            </div>
            <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium inline-flex items-center w-fit">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              System Ready
            </div>
          </div>
        </motion.div>

        {/* Bento-style Grid (No Card Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {instructions.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all"
            >
              <div className="mb-4 p-2 rounded-lg bg-white/5 w-fit">{item.icon}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{item.label}</div>
              <p className="text-slate-200 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Warning & CTA Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-auto flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 gap-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Critical Note</h3>
              <p className="text-sm text-slate-400 max-w-md">
                Do not refresh the browser or navigate away. The interview session is encrypted and timed; any interruption may void your attempt.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/login/permissions?jobId=${jobId}&title=${encodeURIComponent(title)}`)}
            className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Begin Interview <Play className="w-4 h-4 fill-current" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </motion.div>

        {/* Footer Disclaimer */}
        <motion.footer variants={itemVariants} className="mt-8 text-center md:text-left">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-medium">
            Proprietary AI Evaluation Environment • 2024 Adaptive Systems
          </p>
        </motion.footer>
      </motion.main>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default function InterviewInstructionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <InstructionsContent />
    </Suspense>
  );
}