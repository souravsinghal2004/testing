"use client";

import { Header } from "@/components/inside/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function JobsPage() {

  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  console.log("👤 FRONTEND USER:", user);
}, [user]);

 useEffect(() => {
  if (!isLoaded || !user) return;

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/recruiter/jobs", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, [isLoaded, user]);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">

        {/* 🔹 SIDEBAR */}
       <aside className="fade-in w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 px-6 py-8">
          <h2 className="text-xl font-bold text-blue-400 mb-8">
            Recruiter Panel
          </h2>

          <nav className="space-y-4">
            <button
              onClick={() => router.push("/recruiter")}
               className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              ➕ Post New Job
            </button>

            <button className="block w-full  font-bold  fill-amber-400 text-2xl text-left  text-white/90 px-3 py-2 rounded-lg hover:bg-white/5   ">
               Your Jobs
            </button>

            <button
              onClick={() => router.push("/recruiter/results")}
                className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              📊 Candidate Results
            </button>

            <button
              onClick={() => router.push("/recruiter/profile")}
                className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              👤 Profile
            </button>
          </nav>
        </aside>

        {/* 🔹 MAIN */}
        <main className="flex-1 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500">

          <h1 className="text-2xl font-bold mb-6 text-blue-400">
            Your Posted Jobs
          </h1>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p>No jobs posted yet.</p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className=" card-hover card-glow card-lift card-border cursor-pointer   rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1px] shadow-xl"
                >
                  <div className="rounded-3xl bg-[#020617] p-6 text-white">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {job.title}
                        </h2>
                        <p className="text-gray-400 text-sm">
                          {job.company}
                        </p>
                      </div>

                      <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                        Actively Hiring
                      </span>
                    </div>

                    {/* ABOUT */}
                    {job.about && (
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {job.about}
                      </p>
                    )}

                    {/* INFO */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
                        🏠 {job.workMode || "Work from home"}
                      </div>

                      {job.duration && (
                        <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
                          ⏳ {job.duration}
                        </div>
                      )}

                      {job.stipend && (
                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl col-span-2">
                          💰 ₹{job.stipend?.min} - ₹{job.stipend?.max}/month
                        </div>
                      )}
                    </div>

                    {/* SKILLS */}
                    {job.skills?.length > 0 && (
                      <div className="mb-5 flex flex-wrap gap-2">
                        {job.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* FOOTER */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Your Job Post
                      </span>

                      <Link
  href={`/recruiter/jobs/${job._id}`}
  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
>
  View Job
</Link>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </div>
  );
}