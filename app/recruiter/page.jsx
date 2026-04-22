"use client";

import { Header } from "@/components/inside/Header";
import { useRouter } from "next/navigation";
import Navbar from "@/components/inside/Navbar";
export default function RecruiterDashboard() {
  const router = useRouter();

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
      
      <Header />

      <div className="flex h-[calc(100vh-64px)]">

        {/* 🔹 SIDEBAR */}
       <aside className="fade-in w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 px-6 py-8">
          <h2 className="text-xl font-bold text-blue-400 mb-8">
            Recruiter Panel
          </h2>

          <nav className="space-y-4">

            <button
              className="block w-full text-left font-semibold text-blue-400"
            >
              ➕ Post New Job
            </button>

            <button
              onClick={() => router.push("/recruiter/jobs")}
              className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              📋 Your Jobs
            </button>

            <button
              onClick={() => router.push("/recruiter/results")}
           className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              📊 Candidate Results
            </button>

            <button
              onClick={() => router.push("/recruiter/profile")}
             className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              👤 Profile
            </button>
          </nav>
        </aside>

        {/* 🔹 MAIN */}
        <main className="flex-1 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 ">

          <h1 className="text-3xl font-bold text-blue-300 mb-4">
            Post a New Job
          </h1>

          <p className="text-gray-400 mb-8">
            Create a job listing and let AI screen the best candidates for you.
          </p>

          {/* 🔥 BIG CTA CARD */}
          <div
            onClick={() => router.push("/recruiter/postjob")}
            className=" card-hover card-glow card-lift card-border cursor-pointer rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1px] shadow-xl hover:scale-[1.02] transition"
          >
            <div className="rounded-3xl bg-[#020617] p-10 flex flex-col items-center justify-center text-center">

              <div className="text-6xl mb-4 text-blue-400">➕</div>

              <h2 className="text-xl font-semibold mb-2">
                Create New Job Posting
              </h2>

              <p className="text-gray-400 max-w-md">
                Define job role, skills, and requirements. Our AI will automatically
                conduct interviews and rank candidates for you.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}