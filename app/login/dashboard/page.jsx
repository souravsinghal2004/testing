"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState("analytics");
  const [data, setData] = useState(null);

  // ✅ ONLY ONE useEffect (correct place)
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("/api/report");
        const reports = await res.json();

        console.log("REPORTS:", reports); // debug

        if (reports && reports.length > 0) {
          setData(reports[0]); // ✅ DB data
        } else {
          console.log("No data from DB");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchReport();
  }, []);

  // ✅ AFTER hooks (safe)
  if (!data) {
    return <div className="p-10">Loading data from DB...</div>;
  }

  // 🎯 Color Logic
  const getColor = (value) => {
    if (value <= 5) return "#ef4444";
    if (value <= 8) return "#3b82f6";
    return "#22c55e";
  };

  // 📊 Overall Score
  const overallScore =
    Object.values(data.scores || {}).reduce((a, b) => a + b, 0) /
    Object.values(data.scores || {}).length;

  // 💬 Conversation (from AI analysis)
  const conversation =
    data.questionAnalysis?.map((q) => ({
      question: q.question,
      answer: q.feedback,
    })) || [];


   

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white p-6">

    <h1 className="text-2xl font-bold text-blue-300 mb-6">
      Candidate Evaluation Dashboard
    </h1>

    <div className="flex gap-4 mb-6">
      {["analytics", "conversation", "summary"].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-4 py-2 rounded-xl font-semibold capitalize transition ${
            tab === t
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          {t}
        </button>
      ))}
    </div>

    {tab === "analytics" && (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(data.scores || {}).slice(0, 4).map(([key, value]) => (
            <div key={key} className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
              <p className="text-sm text-gray-400 capitalize">
                {key.replaceAll("_", " ")}
              </p>

              <h2 className="text-2xl font-bold" style={{ color: getColor(value) }}>
                {value * 10}%
              </h2>

              <div className="mt-2 h-2 bg-white/10 rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${value * 10}%`,
                    backgroundColor: getColor(value),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <h2 className="font-bold mb-2">Overall Performance</h2>

            <h1 className="text-4xl font-bold mt-4" style={{ color: getColor(overallScore || 0) }}>
              {(overallScore * 10 || 0).toFixed(0)}%
            </h1>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <h2 className="font-bold mb-2">Question Performance</h2>

            <div className="space-y-3">
              {data.questionAnalysis?.map((q, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <span>Q{i + 1}</span>
                    <span style={{ color: getColor(q.score) }}>
                      {q.score * 10}%
                    </span>
                  </div>

                  <div className="h-2 bg-white/10 rounded-full">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${q.score * 10}%`,
                        backgroundColor: getColor(q.score),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h2 className="font-bold mb-4">Detailed Metrics</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.scores || {}).map(([key, value]) => (
              <div key={key} className="border border-white/10 p-3 rounded-lg">
                <p className="text-gray-400 capitalize text-sm">
                  {key.replaceAll("_", " ")}
                </p>
                <p className="font-bold" style={{ color: getColor(value) }}>
                  {value}/10
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    )}

    {tab === "conversation" && (
      <div className="space-y-4">
        {conversation.map((item, index) => (
          <div key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
            <h2 className="font-bold mb-2">
              Q{index + 1}. {item.question}
            </h2>
            <p className="text-gray-300">{item.answer}</p>
          </div>
        ))}
      </div>
    )}

    {tab === "summary" && (
      <div className="space-y-6">
        <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 p-6 rounded-2xl">
          <h2 className="text-green-400 font-bold mb-3">Strengths</h2>
          <ul className="list-disc pl-5">
            {data.strengths?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-red-500/20 p-6 rounded-2xl">
          <h2 className="text-red-400 font-bold mb-3">Weaknesses</h2>
          <ul className="list-disc pl-5">
            {data.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h2 className="font-bold mb-3">Final Summary</h2>
          <p className="text-gray-300">{data.summary}</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center">
          <h2 className="font-bold mb-2">Final Decision</h2>
          <span
            className="px-4 py-2 rounded-lg font-bold"
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

    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => router.push("/login")}
        className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-xl"
      >
        <Home size={22} />
      </button>
    </div>
  </div>
);
}