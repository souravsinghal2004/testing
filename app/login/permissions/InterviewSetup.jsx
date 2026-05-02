"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewSetup() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const title = searchParams.get("title");

  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [mediaAllowed, setMediaAllowed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    async function enableMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        window.__INTERVIEW_STREAM__ = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        detectAudio(stream);
        setMediaAllowed(true);
      } catch (err) {
        setError("Access denied. Please enable camera and microphone in your browser settings.");
      }
    }

    enableMedia();
    return () => stopMedia();
  }, []);

  function detectAudio(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    microphone.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function checkVolume() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setIsSpeaking(volume > 15);
      requestAnimationFrame(checkVolume);
    }
    checkVolume();
  }

  function stopMedia() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function handleGoBack() {
    stopMedia();
    router.back();
  }

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 relative overflow-hidden">
      {/* 🌌 Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          
          {/* Header */}
          <div className="mb-12 text-center md:text-left">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-blue-500 font-mono text-xs uppercase tracking-[0.3em]"
            >
              System Calibration
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-black text-white mt-2 tracking-tight"
            >
              Ready to <span className="text-blue-500 italic">Begin?</span>
            </motion.h1>
            <p className="text-slate-400 mt-4 max-w-md">
              We need to ensure your hardware is optimized for the AI assessment. 
              Please verify your feeds below.
            </p>
          </div>

          {/* Setup Grid */}
         {/* Setup Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* Video Feed */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="group relative flex flex-col"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition" />
              <div className="relative bg-black rounded-3xl overflow-hidden border border-white/10 aspect-video flex-grow flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 z-20">
                  <div className={`w-2 h-2 rounded-full ${mediaAllowed ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">Video Feed</span>
                </div>
                
                <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent group-hover:border-blue-500/5 transition-all duration-500" />
              </div>
            </motion.div>

            {/* Audio Feed */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="group relative flex flex-col"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-10 group-hover:opacity-30 transition" />
              <div className={`relative flex-grow min-h-[200px] md:min-h-full rounded-3xl flex flex-col items-center justify-center border transition-all duration-500 py-8 ${
                isSpeaking ? "bg-emerald-500/10 border-emerald-500/40" : "bg-black border-white/10"
              }`}>
                
                {/* Animated Audio Waveform */}
                <div className="flex items-center gap-1.5 h-12 mb-6">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isSpeaking ? [10, 40, 15, 35, 10] : 8 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5, 
                        delay: i * 0.05 
                      }}
                      className={`w-1.5 rounded-full ${isSpeaking ? 'bg-emerald-400' : 'bg-slate-700'}`}
                    />
                  ))}
                </div>

                <p className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${isSpeaking ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isSpeaking ? "Voice Signal Detected" : "Microphone Testing"}
                </p>
                <p className="text-[10px] text-slate-600 mt-2 font-mono italic px-4 text-center">
                  {isSpeaking ? "Perfect. Proceed when ready." : "Try speaking to confirm audio..."}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3"
              >
                <span className="text-lg">⚠️</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Footer */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
            <button
              onClick={handleGoBack}
              className="text-slate-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>←</span> Abandon Setup
            </button>

            <motion.button
              whileHover={mediaAllowed ? { scale: 1.02 } : {}}
              whileTap={mediaAllowed ? { scale: 0.98 } : {}}
              disabled={!mediaAllowed}
              onClick={() => {
                const candidateName = encodeURIComponent(user?.fullName || "Unknown");
                router.push(`/login/live?jobId=${jobId}&title=${encodeURIComponent(title)}&name=${candidateName}`);
              }}
              className={`group relative px-10 py-4 rounded-2xl font-bold transition-all duration-300 ${
                mediaAllowed
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                Initialize Assessment
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              {mediaAllowed && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl opacity-0 group-hover:opacity-20 transition" />
              )}
            </motion.button>
          </div>

          <p className="text-center text-[10px] text-slate-600 mt-8 uppercase tracking-widest">
            Privacy Secure • AI Encryption Active • {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}