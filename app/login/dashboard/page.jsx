"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  Home, 
  BarChart3, 
  MessageSquare, 
  ClipboardCheck, 
  BrainCircuit, 
  TrendingUp, 
  Award 
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const { id: jobId } = useParams();
  const { user, isLoaded } = useUser();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("analytics");

  // --- LOGIC: KEPT EXACTLY AS PER YOUR FIRST SNIPPET ---
  useEffect(() => {
    if (!isLoaded || !user || !jobId) return;
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/loggedinuserreport?userId=${user.id}&jobId=${jobId}`);
        const reports = await res.json();
        if (reports?.length > 0) setData(reports[0]);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchReport();
  }, [user, isLoaded, jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
        <div className="text-red-400 bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-2xl font-medium backdrop-blur-md">
          No report found
        </div>
        
        <button
          onClick={() => router.push("/login")}
          className="group flex items-center gap-3 bg-white text-black pl-6 pr-5 py-3.5 rounded-full font-bold shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
          title="Go to Home"
        >
          <span className="text-sm">Go to Home</span>
          <div className="bg-black text-white p-2 rounded-full group-hover:bg-blue-600 transition-colors">
            <Home size={18} />
          </div>
        </button>
      </div>
    );
  }

  // --- DATA TRANSFORMATIONS FOR CHARTS ---
  const radarData = Object.entries(data.scores || {}).map(([key, value]) => ({
    subject: key.replaceAll("_", " "),
    A: value * 10,
    fullMark: 100,
  }));

  const chartData = data.questionAnalysis?.map((q, i) => ({
    name: `Q${i + 1}`,
    score: q.score * 10,
  })) || [];

  const overallScore = (Object.values(data.scores || {}).reduce((a, b) => a + b, 0) / 
                       Object.values(data.scores || {}).length) * 10;

  const conversation = data.qa?.map((item) => ({
    question: item.question,
    userAnswer: item.answer,
    aiFeedback: data.questionAnalysis?.find(q => q.question === item.question)?.feedback 
  })) || [];

  const NavButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
        tab === id
          ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span className="capitalize">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto p-6 lg:p-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <BrainCircuit size={20} />
              <span className="text-sm font-semibold tracking-widest uppercase">Hire Byte Report</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              {data.candidateName || "Candidate"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Analysis</span>
            </h1>
          </div>
          
          <div className="flex bg-white/5 p-1.5 rounded-[22px] backdrop-blur-md border border-white/10">
            <NavButton id="analytics" label="Insights" icon={BarChart3} />
            <NavButton id="conversation" label="Transcript" icon={MessageSquare} />
            <NavButton id="summary" label="Verdict" icon={ClipboardCheck} />
          </div>
        </header>

        {/* --- ANALYTICS TAB --- */}
        {tab === "analytics" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Radar Chart Card */}
              <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="text-blue-400" size={20} />
                    Skill Proficiency Map
                  </h2>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Radar
                        name="Candidate"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Overall Score Card */}
              <div className="bg-gradient-to-b from-blue-600 to-blue-800 p-1 rounded-[32px] shadow-2xl shadow-blue-900/20">
                <div className="bg-[#0f172a] h-full w-full rounded-[31px] p-8 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-6">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                      <circle 
                        cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * overallScore) / 100}
                        strokeLinecap="round"
                        className="text-blue-500 transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white">{overallScore.toFixed(0)}%</span>
                      <span className="text-xs text-slate-400 uppercase tracking-tighter">Overall Score</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Match Proficiency</h3>
                  <p className="text-slate-400 text-sm px-4">Performance across all technical and behavioral modules.</p>
                </div>
              </div>
            </div>

            {/* Performance Timeline */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
              <h2 className="text-xl font-bold mb-8">Question Performance Breakdown</h2>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* --- TRANSCRIPT (CONVERSATION) TAB --- */}
        {tab === "conversation" && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {conversation.map((item, index) => (
              <div key={index} className="group relative bg-slate-900/40 hover:bg-slate-900/60 transition-all border border-white/5 p-8 rounded-[24px]">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                    Q{index + 1}
                  </div>
                  <div className="space-y-4 w-full">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {item.question}
                    </h3>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Candidate Response</p>
                      <p className="text-slate-300 leading-relaxed italic">"{item.userAnswer}"</p>
                    </div>
                    {item.aiFeedback && (
                      <div className="pl-4 border-l-2 border-emerald-500/30">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">AI Evaluation</p>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.aiFeedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- SUMMARY (VERDICT) TAB --- */}
        {tab === "summary" && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[32px]">
                <div className="flex items-center gap-3 text-emerald-400 mb-6">
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><Award size={24} /></div>
                  <h2 className="text-xl font-bold">Key Strengths</h2>
                </div>
                <ul className="space-y-4">
                  {data.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                      <span className="leading-tight">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements (Weaknesses) */}
              <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-[32px]">
                <div className="flex items-center gap-3 text-rose-400 mb-6">
                  <div className="p-2 bg-rose-500/10 rounded-lg"><TrendingUp size={24} className="rotate-180" /></div>
                  <h2 className="text-xl font-bold">Areas for Growth</h2>
                </div>
                <ul className="space-y-4">
                  {data.weaknesses?.map((w, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2.5 shrink-0" />
                      <span className="leading-tight">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verdict Card */}
            <div className="bg-slate-900/80 border border-white/10 p-10 rounded-[40px] text-center relative overflow-hidden">
               <div className="relative z-10">
                <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4 font-bold">Executive Summary</h2>
                <p className="max-w-2xl mx-auto text-lg text-slate-300 leading-relaxed mb-10">
                  {data.summary}
                </p>
                <div className="inline-flex flex-col items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-widest mb-3">Decision Verdict</span>
                  <div className={`px-12 py-4 rounded-2xl text-2xl font-black tracking-tighter uppercase transition-all shadow-2xl ${
                    data.hire_recommendation === "Hire" 
                    ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                    : "bg-rose-500 text-white shadow-rose-500/20"
                  }`}>
                    {data.hire_recommendation}
                  </div>
                </div>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[100px] pointer-events-none" />
            </div>
          </div>
        )}

        {/* Floating Home Button */}
        <div className="fixed bottom-10 right-10 z-50">
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 bg-white text-black pl-6 pr-5 py-4 rounded-full font-bold shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            Go Home
            <div className="bg-black text-white p-2 rounded-full group-hover:rotate-12 transition-transform">
                <Home size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}