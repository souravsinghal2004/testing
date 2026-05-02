"use client";

import { useRouter } from "next/navigation";
import { useCheckInterview } from "@/hooks/useCheckInterview";

export default function InterviewButton({ job }) {
  const router = useRouter();
  const { alreadyGiven, loading } = useCheckInterview(job._id);

  const handleClick = () => {
    if (alreadyGiven) {
      router.push(`/login/dashboard/${job._id}`);
    } else {
      router.push(
        `/login/instructions?jobId=${job._id}&title=${encodeURIComponent(job.title)}`
      );
    }
  };

  return (
    <div className="relative group inline-block">
      <button
        disabled={loading}
        onClick={handleClick}
        className={`group relative px-10 py-4 text-white rounded-xl font-bold transition-all overflow-hidden 
          ${loading ? "bg-slate-700 cursor-not-allowed opacity-70" : 
            alreadyGiven 
            ? "bg-slate-800 hover:bg-slate-700 border border-white/10 shadow-xl" 
            : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)]"
          }`}
      >
        {/* Shiny background effect for the blue state */}
        {!alreadyGiven && !loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        )}

        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Checking...
            </>
          ) : alreadyGiven ? (
            "View Report"
          ) : (
            "Give Interview"
          )}
        </span>
      </button>

      {/* Improved Tooltip */}
      {alreadyGiven && !loading && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 
          hidden group-hover:block bg-[#0f172a] text-blue-400 text-xs font-bold border border-blue-500/20
          px-4 py-2 rounded-xl whitespace-nowrap shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          Already completed. Click to view analysis.
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0f172a]" />
        </div>
      )}
    </div>
  );
}