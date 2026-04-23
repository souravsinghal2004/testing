"use client";

import { Header } from "@/components/inside/Header";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
    <Header />

    <div className="flex">

      <aside className="fade-in w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 px-6 py-8">
          <h2 className="text-xl font-bold text-blue-400 mb-8">
            Candidate Panel
          </h2>

        <nav className="space-y-4">
          <button onClick={() => router.push("/login")} className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">
            💼 Available Jobs
          </button>

          <button onClick={() => router.push("/login/results")} className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">
            📊 Interview Results
          </button>

          <button onClick={() => router.push("/login/feedback")}  className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">
            🧠 Skill Feedback
          </button>

          <button      className="block w-full  font-bold  fill-amber-400 text-2xl text-left  text-white/90  py-2 rounded-lg hover:bg-white/5   ">
            Profile & Resume
          </button>
        </nav>
      </aside>

         <main className="flex-1 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500">

        <h1 className="text-3xl font-bold text-blue-300 mb-6">
          Profile & Resume
        </h1>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-6">
          <h2 className="text-lg font-semibold mb-4">Personal Info</h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Name</p>
              <p>{user.fullName}</p>
            </div>

            <div>
              <p className="text-gray-400">Email</p>
              <p>{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Resume</h2>

          <p className="text-gray-400 text-sm mb-4">
            Upload your resume to improve AI matching.
          </p>

          <Link href="/login/upload">
            <button className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-500 shadow-lg">
              Update Resume
            </button>
          </Link>
        </div>

      </main>
    </div>
  </div>
);
}
