"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/inside/Header";

export default function FeedbackPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // 🔥 FETCH ALL REPORTS FOR USER
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchReports = async () => {
      try {
        const res = await fetch(`/api/feedbackreport?userId=${user.id}`);
        const data = await res.json();
        setReports(data || []);
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isLoaded, user]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
     <Header />
   
     <div className="flex h-[calc(100vh-64px)]"> 
        {/* 🔹 SIDEBAR */}
       <aside className="fade-in w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 px-6 py-8">
          <h2 className="text-xl font-bold text-blue-400 mb-8">
            Candidate Panel
          </h2>

          <nav className="space-y-4">
            <button
              onClick={() => router.push("/login")}
              className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              💼 Available Jobs
            </button>

            <button
              onClick={() => router.push("/login/results")}
              className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              📊 Interview Results
            </button>

            <button className="block w-full text-left font-semibold text-blue-400">
              🧠 Skill Feedback
            </button>

            <button
              onClick={() => router.push("/login/profile")}
              className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              📄 Profile
            </button>
          </nav>
        </aside>

        {/* 🔹 MAIN */}
        <main className="flex-1 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500">
          <h1 className="text-3xl font-bold mb-6 text-blue-300">
            AI Skill Feedback
          </h1>

          {loading ? (
            <div>Loading reports...</div>
          ) : reports.length === 0 ? (
            <div>No reports found</div>
          ) : (
            <div className="space-y-10">
              {reports.map((report, index) => {
                const overallScore =
                  Object.values(report.scores || {}).reduce((a, b) => a + b, 0) /
                  Object.values(report.scores || {}).length;

                return (
                  <div
                    key={index}
                    className="rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1px] shadow-xl"
                  >
                    <div className="rounded-3xl bg-[#020617] p-6">

                      {/* 🔥 HEADER */}
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-xl font-semibold text-white">
                            {report.jobTitle}
                          </h2>
                          <p className="text-gray-400 text-sm">
                            {report.candidateName}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-400">Score</p>
                          <h1 className="text-3xl font-bold text-blue-400">
                            {(overallScore * 10).toFixed(0)}%
                          </h1>
                        </div>
                      </div>

                      {/* 🔹 SUMMARY */}
                      <p className="text-gray-300 mb-6">
                        {report.summary}
                      </p>

                      {/* 🔹 GRID */}
                      <div className="grid md:grid-cols-2 gap-6">

                        {/* STRENGTHS */}
                        <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-xl">
                          <h3 className="font-semibold text-green-400 mb-3">
                            ✅ Strengths
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-300">
                            {(report.strengths?.length
                              ? report.strengths
                              : ["No major strengths identified"]).map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>

                        {/* WEAKNESSES */}
                        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl">
                          <h3 className="font-semibold text-red-400 mb-3">
                            ⚠ Weaknesses
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-300">
                            {(report.weaknesses?.length
                              ? report.weaknesses
                              : ["No major weaknesses identified"]).map((w, i) => (
                              <li key={i}>• {w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 🔹 DECISION */}
                      <div className="mt-6 text-center">
                        <span
                          className="px-6 py-2 rounded-full font-bold"
                          style={{
                            backgroundColor:
                              report.hire_recommendation === "Hire"
                                ? "#22c55e"
                                : "#ef4444",
                          }}
                        >
                          {report.hire_recommendation}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
