"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveUI({
  messages,
  videoRef,
  videoContainerRef,
  stopRecording,
  processing,
  title,
  interviewEnded,
  generateReport,
  jobId,
  endInterviewManually,
  alertText,
}) {
  const router = useRouter();
  const [isManualEnd, setIsManualEnd] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const streamRef = useRef(null);
  const hasGeneratedRef = useRef(false);
  const lockRef = useRef(false);

  const shutdownInterview = async () => {
    try {
      const stream =
        videoRef?.current?.srcObject ||
        window.__INTERVIEW_STREAM__ ||
        streamRef.current;

      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      }

      if (videoRef?.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.innerHTML = "";
        videoRef.current.load();
      }

      window.__INTERVIEW_STREAM__ = null;

      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }
    } catch (err) {
      console.error("Shutdown Error:", err);
    }
  };

  useEffect(() => {
    if (showEndPopup) shutdownInterview();
  }, [showEndPopup]);

  const triggerEndInterview = async () => {
    if (lockRef.current) return;
    lockRef.current = true;
    await shutdownInterview();
    endInterviewManually?.();
    setIsManualEnd(true);
    setShowEndPopup(true);
  };

  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    const handleVisibility = () => { if (document.hidden) triggerEndInterview(); };
    const handleBlur = () => triggerEndInterview();
    const handleFsChange = () => { if (!document.fullscreenElement) triggerEndInterview(); };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  useEffect(() => {
    if (alertText === "Cheating Detected - Interview Ended") triggerEndInterview();
  }, [alertText]);

  useEffect(() => {
    if (!interviewEnded || hasGeneratedRef.current) return;
    
    // 1. Immediately lock and show UI to give instant feedback
    hasGeneratedRef.current = true;
    lockRef.current = true;
    setShowEndPopup(true); 
    
    // 2. Shut down hardware immediately
    shutdownInterview();

    const handleGenerate = async () => {
      try {
        // 3. Start the heavy lifting in the background
        await generateReport();
      } catch (e) {
        console.error("Report Generation Failed", e);
      } finally {
        // 4. Navigate only after the report is done
        // We use a small delay so the user sees the "Processing" state
        setTimeout(() => router.push(`/login/dashboard/${jobId}`), 1000);
      }
    };

    handleGenerate();
  }, [interviewEnded, jobId, router, generateReport]); // Added missing dependencies

  useEffect(() => {
    if (showEndPopup && isManualEnd && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0 && isManualEnd) router.push("/login");
  }, [showEndPopup, countdown, isManualEnd]);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#020617] text-slate-100 flex flex-col font-sans relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Live Session</h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Target: {title}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold italic">Anti-Cheat System</span>
            <span className="text-xs text-blue-400 font-mono">Active_Monitoring_v2.4</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <button
            onClick={triggerEndInterview}
            className="text-[10px] font-bold border border-red-500/50 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 uppercase tracking-tighter"
          >
            Terminate
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 p-6 gap-6 overflow-hidden">
        {/* LEFT: INTERACTION HUB */}
        <div className="w-1/2 flex flex-col justify-between py-4">
          <div className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl"
            >
              <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2 italic">// SESSION_GUIDE</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Maintain eye contact with the camera. Switching tabs or exiting fullscreen will result in an <span className="text-red-400 font-bold italic underline">immediate termination</span>.
              </p>
            </motion.div>

            <div className="space-y-4 pr-12">
              <AnimatePresence mode="popLayout">
                {messages.slice(-2).map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`p-5 rounded-2xl text-sm leading-relaxed ${
                      m.sender === "ai"
                        ? "bg-blue-600/10 border border-blue-500/20 text-blue-100"
                        : "bg-emerald-600/10 border border-emerald-500/20 text-emerald-100 ml-auto"
                    } max-w-[85%] shadow-xl`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[10px] font-black uppercase tracking-tighter opacity-50 font-mono">
                      {m.sender === "ai" ? "System_AI" : "Candidate"}
                    </div>
                    {m.text === "__THINKING__" ? (
                      <div className="flex gap-1 py-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    ) : m.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600">
            <span className="animate-pulse">●</span>
            <span>ENCRYPTED_UDP_CONNECTION</span>
            <span className="text-slate-800">|</span>
            <span>LATENCY: 24MS</span>
          </div>
        </div>

        {/* RIGHT: CAMERA MONITOR */}
        <div className="w-1/2 flex flex-col gap-6">
          <div
            ref={videoContainerRef}
            // CHANGED: Removed 'border' and 'border-transparent' classes to kill the white outline
            className="relative flex-1 overflow-hidden rounded-[2.5rem] bg-[#020617] group shadow-2xl"
          >
            <AnimatePresence>
              {alertText && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-md"
                >
                  <div className="bg-red-500/90 backdrop-blur-md border border-red-400/50 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-[0_10px_30px_rgba(239,68,68,0.4)]">
                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] leading-none mb-1">Security Warning</span>
                      <span className="text-xs font-bold text-white tracking-tight uppercase">{alertText}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-500/30 m-6 rounded-tl-xl z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-500/30 m-6 rounded-br-xl z-20 pointer-events-none" />

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              // CHANGED: Added bg-[#020617] directly to video and ensured it fills the space perfectly
              className="absolute inset-0 w-full h-full object-cover bg-[#020617] scale-x-[-1] opacity-90 transition-opacity duration-700 group-hover:opacity-100"
            />
          </div>

          {/* CONTROL BOX */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex gap-4 backdrop-blur-xl">
            <button
              disabled={processing}
              onClick={stopRecording}
              className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-500 ${
                processing
                  ? "bg-slate-800 text-slate-600"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]"
              }`}
            >
              {processing ? "Synthesizing..." : "Submit Response"}
            </button>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showEndPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)]" />
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-12">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 border-t-2 border-b-2 border-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute inset-3 border-l-2 border-r-2 border-indigo-500/40 rounded-full" />
                <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="absolute inset-8 bg-blue-500 rounded-full flex items-center justify-center" >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic">
                  {isManualEnd ? "Assessment Interrupted" : "Processing Neural Markers"}
                </h2>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <p className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.4em]">
                    {isManualEnd ? "Security_Protocol_Active" : "AI_Synthesis_In_Progress"}
                  </p>
                </div>
                {isManualEnd && (
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Redirecting...</span>
                    <div className="text-7xl font-black text-blue-500 font-mono tracking-tighter">0{countdown}</div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="h-6" />
    </div>
  );
}