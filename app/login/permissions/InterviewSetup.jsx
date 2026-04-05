"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function InterviewSetup() {

  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const title = searchParams.get("title");

  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const videoRef = useRef(null);
  const audioBoxRef = useRef(null);
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
window.__INTERVIEW_STREAM__ = stream; // ✅ ADD THIS

if (videoRef.current) {
  videoRef.current.srcObject = stream;
}

        detectAudio(stream);
        setMediaAllowed(true);
      } catch (err) {
        setError("Camera and microphone access is required to continue.");
      }
    }

    enableMedia();

    return () => stopMedia();
  }, []);

  function detectAudio(stream) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 512;
    microphone.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function checkVolume() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      setIsSpeaking(volume > 10);
      requestAnimationFrame(checkVolume);
    }

    checkVolume();
  }

  function stopMedia() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
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
  <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 flex items-center justify-center px-4 text-white">

    <div className="w-full max-w-4xl rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1px] shadow-xl">

      <div className="bg-[#020617] rounded-3xl p-8">

        {/* 🔥 TITLE */}
        <h1 className="text-3xl font-bold text-blue-300 mb-4">
          Interview Setup
        </h1>

        <p className="text-gray-400 mb-6">
          Enable camera & microphone before starting your interview.
        </p>

        {/* 🔹 GRID */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* 🎥 CAMERA */}
          <div className="flex-1">
            <p className="text-sm font-medium mb-2 text-gray-300">
              🎥 Camera Preview
            </p>

            <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
          </div>

          {/* 🎤 AUDIO */}
          <div className="flex-1">
            <p className="text-sm font-medium mb-2 text-gray-300">
              🎤 Microphone Test
            </p>

            <div
              ref={audioBoxRef}
              className={`h-64 rounded-xl flex items-center justify-center text-sm transition-all border ${
                isSpeaking
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-white/10 bg-white/5 text-gray-400"
              }`}
            >
              {isSpeaking
                ? "Audio Detected ✔"
                : "Speak to test microphone"}
            </div>
          </div>

        </div>

        {/* ❌ ERROR */}
        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}

        {/* 🔹 BUTTONS */}
        <div className="flex justify-between mt-8">

          <button
            onClick={handleGoBack}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            ← Go Back
          </button>

          <button
            disabled={!mediaAllowed}
            onClick={() => {
              const candidateName = encodeURIComponent(user?.fullName || "Unknown");
              router.push(
                `/login/live?jobId=${jobId}&title=${encodeURIComponent(title)}&name=${candidateName}`
              );
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              mediaAllowed
                ? "bg-blue-600 hover:bg-blue-500 shadow-lg"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Proceed to Interview →
          </button>

        </div>

        {/* 🔹 FOOTNOTE */}
        <p className="text-xs text-gray-500 mt-6">
          * Camera & microphone are used only during the interview session.
        </p>

      </div>
    </div>
  </div>
);
}