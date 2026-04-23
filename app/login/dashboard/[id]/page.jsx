"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Home, Trophy, AlertCircle, BarChart3, MessageSquare } from "lucide-react";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const { id: jobId } = useParams();
  const { user, isLoaded } = useUser();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("analytics");

  useEffect(() => {
    if (!isLoaded || !user || !jobId) return;
    const fetchReport = async () => {
      const res = await fetch(`/api/loggedinuserreport?userId=${user.id}&jobId=${jobId}`);
      const reports = await res.json();
      if (reports?.length > 0) setData(reports[0]);
      setLoading(false);
    };
    fetchReport();
  }, [user, isLoaded, jobId]);

  if (loading) return <div className="p-10 text-white bg-black h-screen">Loading...</div>;
  if (!data) return <div className="p-10 text-red-500 bg-black h-screen">No report found</div>;

  const getColor = (v) => (v <= 5 ? "#ef4444" : v <= 8 ? "#3b82f6" : "#22c55e");
  
  const overallScore = Object.values(data.scores || {}).reduce((a, b) => a + b, 0) / 
                       Object.values(data.scores || {}).length;

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
          <p className="text-gray-400 text-sm mt-1">Detailed performance report for {data.candidateName || "Candidate"}</p>
        </div>
        
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {["analytics", "conversation"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-xl font-bold capitalize transition-all ${
                tab === t ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "analytics" && (
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* 1. TOP ROW: FINAL VERDICT & OVERALL SCORE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy size={120} />
              </div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Final Recommendation</p>
              <h2 className={`text-5xl font-black mb-4 ${data.hire_recommendation === "Hire" ? "text-emerald-400" : "text-rose-500"}`}>
                {data.hire_recommendation === "Hire" ? "PROCEED" : "No Hire"}
              </h2>
              <p className="text-gray-300 italic text-lg leading-relaxed border-l-2 border-blue-500/50 pl-4">
                "{data.summary}"
              </p>
            </div>

            <div className="bg-blue-600 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-900/20">
              <p className="text-blue-200 font-bold uppercase tracking-tighter text-sm mb-2">Overall Proficiency</p>
              <h1 className="text-7xl font-black text-white">
                {(overallScore * 10 || 0).toFixed(0)}<span className="text-2xl opacity-60">%</span>
              </h1>
              <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${overallScore * 10}%` }} />
              </div>
            </div>
          </div>

          {/* 2. STRENGTHS & WEAKNESSES (The Summary Part) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Trophy size={20} /></div>
                <h3 className="font-bold text-emerald-100">Key Strengths</h3>
              </div>
              <ul className="space-y-3">
                {data.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-emerald-100/80 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400"><AlertCircle size={20} /></div>
                <h3 className="font-bold text-rose-100">Critical Improvements</h3>
              </div>
              <ul className="space-y-3">
                {data.weaknesses?.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-rose-100/80 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. METRICS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.scores || {}).map(([key, value]) => (
              <div key={key} className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-3xl hover:border-blue-500/30 transition-colors">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{key.replaceAll("_", " ")}</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold" style={{ color: getColor(value) }}>{value * 10}%</span>
                </div>
                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value * 10}%`, backgroundColor: getColor(value) }} />
                </div>
              </div>
            ))}
          </div>

          {/* 4. QUESTION PERFORMANCE LIST */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-400" />
              Question-by-Question Breakdown
            </h3>
            <div className="space-y-6">
              {data.questionAnalysis?.map((q, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-400">Q{i + 1}: {q.question.substring(0, 50)}...</span>
                    <span className="font-bold text-sm" style={{ color: getColor(q.score) }}>{q.score * 10}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${q.score * 10}%`, backgroundColor: getColor(q.score) }} />
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

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-500 hover:scale-110 text-white p-4 rounded-2xl shadow-2xl transition-all active:scale-95"
        >
          <Home size={24} />
        </button>
      </div>
    </div>
  );
}