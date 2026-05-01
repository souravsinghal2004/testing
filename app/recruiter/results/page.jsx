"use client";

import { Header } from "@/components/inside/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecruiterDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/recruiter/jobs", {
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
  }, []);

  return (
    <div className="h-screen overflow-hidden              bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
      
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

            <button
              onClick={() => router.push("/recruiter/jobs")}
                className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              📋 Your Jobs
            </button>
{/* ACTIVE */}
<button
className="block w-full  font-bold  fill-amber-400 text-2xl text-left  text-white/90 py-2 rounded-lg hover:bg-white/5   "
>
   Candidate Results
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
        <main className="flex-1 p-10 overflow-y-auto">

          <h1 className="text-3xl font-bold text-blue-300 mb-6">
            Your Jobs
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-400">No jobs posted yet.</p>
          ) : (

            <div className="card-hover card-glow card-lift card-border cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

              <table className="w-full text-sm text-left">

                {/* HEADER */}
                <thead className="bg-white/10 text-blue-300">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {jobs.map((job, index) => (
                    <tr
                      key={job._id}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4 font-semibold">{job.title}</td>
                      <td className="p-4">{job.company}</td>
                      <td className="p-4">{job.location}</td>
                      <td className="p-4">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => router.push(`/recruiter/results/${job._id}`)}
                          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          View Result
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}