"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function InstructionsContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const jobId = searchParams.get("jobId");

  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 flex items-center justify-center px-4 text-white">

    <div className="bg-black/40 backdrop-blur-xl border border-white/10 max-w-2xl w-full p-8 rounded-3xl shadow-xl">

      <h1 className="text-3xl font-bold text-blue-300 mb-4">
        Interview Instructions
      </h1>

      <p className="text-gray-400 mb-6">
        Please read carefully before starting the AI interview.
      </p>

      <ul className="space-y-4 text-sm text-gray-300">
        <li>✅ Stable internet connection required</li>
        <li>✅ Answer clearly & honestly</li>
        <li>✅ Technical + logical questions included</li>
        <li>✅ AI evaluates your responses</li>
        <li>⚠️ Do not refresh during interview</li>
      </ul>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.back()}
          className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20"
        >
          ← Go Back
        </button>

        <button
          onClick={() =>
            router.push(`/login/permissions?jobId=${jobId}&title=${encodeURIComponent(title)}`)
          }
          className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 shadow-lg"
        >
          Start Interview
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-6">
        AI-assisted evaluation only. Final decision by recruiters.
      </p>
    </div>
  </div>
);
}

export default function InterviewInstructionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InstructionsContent />
    </Suspense>
  );
}