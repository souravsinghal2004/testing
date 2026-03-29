"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { id: jobId } = useParams();
  const { user, isLoaded } = useUser();

  const [data, setData] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("analytics");

  // 🔹 Fetch JOB
  useEffect(() => {
    if (!jobId) return;
    const fetchJob = async () => {
      const res = await fetch(`/api/job?jobId=${jobId}`);
      const j = await res.json();
      setJob(j);
    };
    fetchJob();
  }, [jobId]);

  // 🔹 Fetch REPORT
  useEffect(() => {
    if (!isLoaded || !user || !jobId) return;

    const fetchReport = async () => {
      const res = await fetch(
        `/api/loggedinuserreport?userId=${user.id}&jobId=${jobId}`
      );
      const reports = await res.json();

      if (reports?.length > 0) {
        setData(reports[0]);
      }
      setLoading(false);
    };

    fetchReport();
  }, [user, isLoaded, jobId]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!data) return <div className="p-10 text-red-500">No report found</div>;

  // 🎯 Color
  const getColor = (v) => (v <= 5 ? "#ef4444" : v <= 8 ? "#3b82f6" : "#22c55e");

  const overallScore =
    Object.values(data.scores || {}).reduce((a, b) => a + b, 0) /
    Object.values(data.scores || {}).length;

  const conversation =
    data.questionAnalysis?.map((q) => ({
      question: q.question,
      answer: q.feedback,
    })) || [];

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6">

      {/* 🔥 TOP CARD (IMAGE STYLE) */}
      <div className="rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1.5px] shadow-xl mb-8">
        <div className="rounded-3xl bg-gradient-to-r from-black to-blue-600 p-6 flex justify-between items-center">

          {/* LEFT */}
          <div className="flex items-center gap-5">
            <img
              src={user?.imageUrl || "/default.png"}
              className="w-20 h-20 rounded-full border-2 border-white"
            />

            <div>
              <h2 className="text-white text-xl font-semibold">
                {user?.fullName}
              </h2>
              <p className="text-gray-300 text-sm">
                {user?.primaryEmailAddress?.emailAddress}
              </p>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-2 mt-3">
                {(job?.skills || []).map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-[#1e293b] text-blue-200 border border-blue-400/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-end gap-3">
            <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold">
              {data.hire_recommendation === "Hire" ? "SELECTED" : "REJECTED"}
            </span>

            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                {job?.jobType || "Internship"}
              </span>
              <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs">
                hard
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 TABS */}
      <div className="flex gap-4 mb-6">
        {["analytics", "conversation", "summary"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize ${
              tab === t
                ? "bg-blue-500 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ================= ANALYTICS ================= */}
      {tab === "analytics" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(data.scores || {}).slice(0, 4).map(([k, v]) => (
              <div key={k} className="bg-white p-4 rounded-xl border">
                <p className="text-sm text-gray-500 capitalize">
                  {k.replaceAll("_", " ")}
                </p>
                <h2 className="text-2xl font-bold" style={{ color: getColor(v) }}>
                  {v * 10}%
                </h2>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <h2 className="font-bold mb-2">Overall Performance</h2>
            <h1
              className="text-4xl font-bold"
              style={{ color: getColor(overallScore) }}
            >
              {(overallScore * 10).toFixed(0)}%
            </h1>
          </div>
        </>
      )}

      {/* ================= CONVERSATION ================= */}
      {tab === "conversation" && (
        <div className="space-y-4">
          {conversation.map((c, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border">
              <h2 className="font-bold mb-2">
                Q{i + 1}. {c.question}
              </h2>
              <p>{c.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* ================= SUMMARY ================= */}
      {tab === "summary" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border">
            <h2 className="text-green-600 font-bold">Strengths</h2>
            <ul className="list-disc pl-5">
              {data.strengths?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <h2 className="text-red-500 font-bold">Weaknesses</h2>
            <ul className="list-disc pl-5">
              {data.weaknesses?.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border text-center">
            <h2 className="font-bold mb-2">Final Decision</h2>
            <span
              className="px-4 py-2 rounded-lg text-white"
              style={{
                backgroundColor:
                  data.hire_recommendation === "Hire"
                    ? "#22c55e"
                    : "#ef4444",
              }}
            >
              {data.hire_recommendation}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}