"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DetailedReportPage() {
  const { id: jobId, reportId } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("analytics");

  useEffect(() => {
    if (!reportId) return;

    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/recruiter/report/${reportId}`, {
          credentials: "include",
        });

        const result = await res.json();

        if (result.success) {
          setData(result.report);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) return <div className="p-10 text-white">Loading...</div>;
  if (!data) return <div className="p-10 text-red-500">No report found</div>;

  // 🎯 helper
  const getColor = (v) =>
    v <= 5 ? "#ef4444" : v <= 8 ? "#3b82f6" : "#22c55e";

  const scoreValues = Object.values(data.scores || {});
  const overallScore =
    scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;

  const conversation =
    data.questionAnalysis?.map((q) => ({
      question: q.question,
      answer: q.feedback,
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white p-6">

      <h1 className="text-2xl font-bold text-blue-300 mb-6">
        Candidate Evaluation
      </h1>

      {/* 🔹 Tabs */}
      <div className="flex gap-4 mb-6">
        {["analytics", "conversation", "summary"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-semibold capitalize ${
              tab === t
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 🔹 ANALYTICS */}
      {tab === "analytics" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(data.scores || {}).slice(0, 4).map(([k, v]) => (
              <div key={k} className="bg-black/40 p-4 rounded-xl">
                <p className="text-sm text-gray-400 capitalize">
                  {k.replaceAll("_", " ")}
                </p>
                <h2 className="text-2xl font-bold" style={{ color: getColor(v) }}>
                  {v * 10}%
                </h2>
              </div>
            ))}
          </div>

          <div className="bg-black/40 p-6 rounded-xl mb-6">
            <h2 className="font-bold mb-2">Overall Score</h2>
            <h1
              className="text-4xl font-bold"
              style={{ color: getColor(overallScore || 0) }}
            >
              {(overallScore * 10).toFixed(0)}%
            </h1>
          </div>

          <div className="bg-black/40 p-6 rounded-xl">
            <h2 className="font-bold mb-4">All Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(data.scores || {}).map(([k, v]) => (
                <div key={k} className="border p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    {k.replaceAll("_", " ")}
                  </p>
                  <p className="font-bold">{v}/10</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 🔹 CONVERSATION */}
      {tab === "conversation" && (
        <div className="space-y-4">
          {conversation.map((item, i) => (
            <div key={i} className="bg-black/40 p-5 rounded-xl">
              <h2 className="font-bold mb-2">
                Q{i + 1}. {item.question}
              </h2>
              <p className="text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 SUMMARY */}
      {tab === "summary" && (
        <div className="space-y-6">

          <div className="bg-black/40 p-6 rounded-xl border border-green-500/20">
            <h2 className="text-green-400 font-bold mb-2">Strengths</h2>
            <ul className="list-disc pl-5">
              {data.strengths?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-black/40 p-6 rounded-xl border border-red-500/20">
            <h2 className="text-red-400 font-bold mb-2">Weaknesses</h2>
            <ul className="list-disc pl-5">
              {data.weaknesses?.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="bg-black/40 p-6 rounded-xl">
            <h2 className="font-bold mb-2">Summary</h2>
            <p>{data.summary}</p>
          </div>

          <div className="bg-black/40 p-6 rounded-xl text-center">
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

      {/* 🔹 BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="fixed bottom-6 right-6 bg-blue-600 px-5 py-3 rounded-full"
      >
        ⬅ Back
      </button>

    </div>
  );
}