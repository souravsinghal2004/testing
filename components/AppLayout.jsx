"use client";

import { Header } from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function AppLayout({ children, active }) {
  const router = useRouter();

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">

      {/* 🔥 FIXED HEADER */}
      <Header />

      <div className="flex h-[calc(100vh-64px)]">

        {/* 🔹 SIDEBAR (FIXED) */}
        <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 px-6 py-8">
          <h2 className="text-xl font-bold text-blue-400 mb-8">
            Candidate Panel
          </h2>

          <nav className="space-y-4">
            <button
              onClick={() => router.push("/login")}
              className={`block w-full text-left ${
                active === "jobs" ? "text-blue-400 font-semibold" : "hover:text-blue-400"
              }`}
            >
              💼 Available Jobs
            </button>

            <button
              onClick={() => router.push("/login/results")}
              className={`block w-full text-left ${
                active === "results" ? "text-blue-400 font-semibold" : "hover:text-blue-400"
              }`}
            >
              📊 Interview Results
            </button>

            <button
              onClick={() => router.push("/login/feedback")}
              className={`block w-full text-left ${
                active === "feedback" ? "text-blue-400 font-semibold" : "hover:text-blue-400"
              }`}
            >
              🧠 Skill Feedback
            </button>

            <button
              onClick={() => router.push("/login/profile")}
              className={`block w-full text-left ${
                active === "profile" ? "text-blue-400 font-semibold" : "hover:text-blue-400"
              }`}
            >
              📄 Profile
            </button>
          </nav>
        </aside>

        {/* 🔥 SCROLLABLE MAIN ONLY */}
        <main className="flex-1 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500">
          {children}
        </main>

      </div>
    </div>
  );
}