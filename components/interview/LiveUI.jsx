"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
}) {
  const router = useRouter();

  const [isManualEnd, setIsManualEnd] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [generatingReport, setGeneratingReport] = useState(false);
const streamRef = useRef(null);
  const hasGeneratedRef = useRef(false);
  const lockRef = useRef(false);

  const exitFullScreen = async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.log("Exit fullscreen error:", err);
  }
};

 const shutdownInterview = async () => {
  try {
    const stream =
      window.__INTERVIEW_STREAM__ ||
      videoRef?.current?.srcObject ||
      streamRef.current;

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    // cleanup all references
    streamRef.current = null;
    window.__INTERVIEW_STREAM__ = null;

    if (videoRef?.current) {
      videoRef.current.srcObject = null;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }

  } catch (err) {
    console.log("Shutdown error:", err);
  }
};

  const triggerEndInterview = async () => {
    if (lockRef.current) return;
    lockRef.current = true;

    await shutdownInterview();
    endInterviewManually?.();
    setIsManualEnd(true);
    setShowEndPopup(true);

   
  };

  // FORCE FULLSCREEN ON LOAD
  useEffect(() => {
    const enterFullScreen = async () => {
      try {
        const el = document.documentElement;

        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          await el.msRequestFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen error:", err);
      }
    };

    enterFullScreen();
  }, []);

  // ANTI CHEAT LISTENERS
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) triggerEndInterview();
    };

    const handleBlur = () => {
      triggerEndInterview();
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) triggerEndInterview();
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        triggerEndInterview();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // GENERATE REPORT (AUTO ONLY)
  const handleGenerate = async () => {
    setGeneratingReport(true);

    try {
      await generateReport();
    } catch (e) {
      console.log("Report failed but continuing...");
    }

    setTimeout(() => {
      router.push(`/login/dashboard/${jobId}`);
    }, 1500);
  };

  // AUTO END → GENERATE REPORT
  useEffect(() => {
    if (!interviewEnded || hasGeneratedRef.current) return;

    hasGeneratedRef.current = true;

    shutdownInterview();
    setShowEndPopup(true);
    handleGenerate();
  }, [interviewEnded]);

  // MANUAL END → COUNTDOWN REDIRECT
  useEffect(() => {
    if (showEndPopup && isManualEnd && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (countdown === 0 && isManualEnd) {
      router.push("/login");
    }
  }, [showEndPopup, countdown, isManualEnd]);

  useEffect(() => {
  return () => {
    shutdownInterview();
  };
}, []);


  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-gray-900 p-8 flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">AI Live Interview</h1>
        <div className="text-sm text-gray-500">Stay focused on camera</div>
      </div>

      <div className="flex flex-1 gap-10">

        {/* LEFT */}
        <div className="flex flex-col justify-between w-1/2">

          <div className="mb-6">
            <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold">
              Interview for this {title}
            </span>
          </div>

          {/* MESSAGES */}
          <div className="flex flex-col space-y-4">
            {messages.slice(-2).map((m, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg text-sm max-w-[90%] ${
                  m.sender === "ai"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-green-100 text-green-900 self-end"
                }`}
              >
                {m.sender === "ai" ? "🤖 " : "🧑 "}
                {m.text === "__THINKING__" ? "..." : m.text}
              </div>
            ))}
          </div>

          {/* RULES */}
          <div className="bg-blue-100 p-5 rounded-xl text-sm text-blue-900 mt-6">
            <b>⚠ Interview Rules</b>
            <p className="mt-2">
              Switching tab / minimizing / exiting fullscreen will end interview.
            </p>
          </div>
        </div>

        {/* CAMERA */}
        <div
          ref={videoContainerRef}
          className="relative w-1/2 rounded-2xl overflow-hidden border-2 border-red-400 bg-black flex items-center justify-center"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between items-center mt-6">

        <button
          onClick={triggerEndInterview}
          className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
        >
          End Interview
        </button>

        <button
          disabled={processing}
          onClick={stopRecording}
          className={`px-8 py-3 rounded-xl font-semibold ${
            processing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Submit Answer
        </button>
      </div>

      {/* POPUP */}
      {showEndPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-10 py-8 rounded-2xl text-center w-[360px]">

            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-400 mx-auto mb-4"></div>

            <h2 className="text-xl font-semibold mb-2 text-white">
              {isManualEnd ? "Interview Interrupted" : "Generating Report..."}
            </h2>

            <p className="text-gray-300 text-sm">
              {isManualEnd
                ? "Redirecting..."
                : "Analyzing performance"}
            </p>

            {isManualEnd && (
              <div className="mt-4 text-3xl font-bold text-blue-400">
                {countdown}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}