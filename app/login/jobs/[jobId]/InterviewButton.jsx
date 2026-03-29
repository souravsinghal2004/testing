"use client";

import { useRouter } from "next/navigation";
import { useCheckInterview } from "@/hooks/useCheckInterview";

export default function InterviewButton({ job }) {
  const router = useRouter();
  const { alreadyGiven, loading } = useCheckInterview(job._id);

  return (
    <div className="relative group inline-block">

      <button
        disabled={loading}
        onClick={() => {
          if (alreadyGiven) {
            router.push(`/login/dashboard/${job._id}`);
          } else {
            router.push(
              `/login/instructions?jobId=${job._id}&title=${encodeURIComponent(job.title)}`
            );
          }
        }}
        className={`inline-block px-6 py-3 rounded-lg text-white transition ${
          alreadyGiven
            ? "bg-gray-400 cursor-pointer"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading
          ? "Checking..."
          : alreadyGiven
          ? "Give Interview"
          : "Give Interview"}
      </button>

      {/* Tooltip */}
      {alreadyGiven && !loading && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
          hidden group-hover:block bg-black text-white text-sm 
          px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
          Already given interview Click to view report
        </div>
      )}
    </div>
  );
}