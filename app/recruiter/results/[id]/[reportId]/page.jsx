"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Home, MessageSquare } from "lucide-react";

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

  if (loading)
    return <div className="p-10 text-white bg-black h-screen">Loading...</div>;
  if (!data)
    return <div className="p-10 text-red-500 bg-black h-screen">No report found</div>;

  const getColor = (v) =>
    v <= 5 ? "#ef4444" : v <= 8 ? "#3b82f6" : "#22c55e";

  const scoreValues = Object.values(data.scores || {});
  const overallScore =
    scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;

 const conversation = data.qa?.map((item) => ({
    question: item.question,
    userAnswer: item.answer,
    aiFeedback: data.questionAnalysis?.find(q => q.question === item.question)?.feedback 
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white p-6 pb-24">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Hire Byte
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Candidate Evaluation Report
          </p>
        </div>

        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {["analytics", "conversation",].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-xl font-bold capitalize transition-all ${
                tab === t
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 ANALYTICS */}
      {tab === "analytics" && (
        <div className="max-w-5xl mx-auto space-y-6">

          {/* TOP SECTION */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <p className="text-sm text-gray-400 mb-2">Final Decision</p>
              <h2
                className={`text-3xl font-bold ${
                  data.hire_recommendation === "Hire"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {data.hire_recommendation}
              </h2>
              <p className="text-gray-400 text-sm mt-3">
                {data.summary}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
              <p className="text-sm text-gray-400 mb-2">Overall Score</p>
              <h1
                className="text-5xl font-bold"
                style={{ color: getColor(overallScore || 0) }}
              >
                {(overallScore * 10 || 0).toFixed(0)}%
              </h1>
            </div>

          </div>

          {/* STRENGTHS & WEAKNESSES */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="font-semibold mb-3 text-green-400">
                Strengths
              </h3>
              <ul className="list-disc ml-5 text-gray-300 text-sm space-y-1">
                {data.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="font-semibold mb-3 text-red-400">
                Improvements
              </h3>
              <ul className="list-disc ml-5 text-gray-300 text-sm space-y-1">
                {data.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* SCORES */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="font-semibold mb-4">Skill Scores</h3>

            <div className="space-y-4">
              {Object.entries(data.scores || {}).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-400">
                      {key.replaceAll("_", " ")}
                    </span>
                    <span className="text-white font-medium">
                      {value * 10}%
                    </span>
                  </div>

                  <div className="h-2 bg-white/10 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUESTION PERFORMANCE */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="font-semibold mb-4">
              Question Performance
            </h3>

            <div className="space-y-4">
              {data.questionAnalysis?.map((q, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">
                      Q{i + 1}
                    </span>
                    <span className="text-white font-medium">
                      {q.score * 10}%
                    </span>
                  </div>

                  <div className="h-2 bg-white/10 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${q.score * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {tab === "conversation" && (
              <div className="max-w-4xl mx-auto space-y-6">
                {conversation.map((item, index) => (
                  <div key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-black/60 transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl mt-1"><MessageSquare size={18}/></div>
                      <h2 className="text-lg font-bold text-blue-100 leading-tight">Q{index + 1}. {item.question}</h2>
                    </div>
                    
                    <div className="ml-12 space-y-4">
                      <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Candidate Response</p>
                        <p className="text-gray-200 italic">"{item.userAnswer}"</p>
                      </div>
      
                      {item.aiFeedback && (
                        <div className="pl-4 border-l-2 border-emerald-500/30">
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">AI Evaluation</p>
                          <p className="text-gray-400 text-sm leading-relaxed">{item.aiFeedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

      

      {/* FLOAT BUTTON */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => router.back()}
          className="bg-blue-600 hover:bg-blue-500 hover:scale-110 text-white p-4 rounded-2xl shadow-2xl transition-all"
        >
          <Home size={22} />
        </button>
      </div>

    </div>
  );
}