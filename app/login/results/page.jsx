"use client";

import { Header } from "@/components/inside/Header";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InterviewResultsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth check
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // ✅ FETCH REPORTS FROM NEW API
  useEffect(() => {
    if (!user) return;

    async function fetchInterviews() {
      try {
        const res = await fetch(
          `/api/loggedinuserreport?userId=${user.id}`
        );

        const data = await res.json();

        setInterviews(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews();
  }, [user]);

  if (!isLoaded || !isSignedIn) return null;

 return (
  <div className="h-screen overflow-hidden              bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
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
            className="block w-full  font-bold  fill-amber-400 text-2xl text-left  text-white/90  py-2 rounded-lg hover:bg-white/5   "
           >
             Interview Results
          </button>

          <button
            onClick={() => router.push("/login/feedback")}
            className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
          >
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
        <h1 className="text-3xl font-bold text-blue-300 mb-2">
          Interview Results
        </h1>

        <p className="text-gray-400 mb-8">
          View AI-generated scores and recruiter shortlisting status.
        </p>

        {/* 🔥 TABLE CONTAINER */}
        <div className="rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1px] shadow-xl">
          <div className="rounded-3xl bg-[#020617] p-6 overflow-x-auto">

            {loading ? (
              <div>Loading reports...</div>
            ) : interviews.length === 0 ? (
              <div className="text-gray-400">No reports found.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="p-4">Job Role</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {interviews.map((item) => {
                    const avgScore =
                      item?.scores
                        ? Math.round(
                            (Object.values(item.scores).reduce(
                              (a, b) => a + b,
                              0
                            ) /
                              Object.values(item.scores).length) *
                              10
                          )
                        : 0;

                    return (
                      <tr
                        key={item._id}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="p-4 font-medium text-white">
                          {item.jobTitle}
                        </td>

                        <td className="p-4 text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>

                        {/* 🔥 SCORE BADGE */}
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
                            {avgScore}%
                          </span>
                        </td>

                        {/* 🔥 STATUS BADGE */}
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.hire_recommendation === "Hire"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {item.hire_recommendation}
                          </span>
                        </td>

                        {/* 🔥 BUTTON */}
                        <td className="p-4">
                          <button
                            onClick={() =>
                              router.push(`/login/dashboard/${item.jobId}`)
                            }
                            className="text-blue-400 hover:text-blue-300 font-medium"
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          * AI scores assist in evaluation. Final decision is by recruiters.
        </p>
      </main>
    </div>
  </div>
);
}