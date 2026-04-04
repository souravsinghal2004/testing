"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/recruiter/jobs/${id}`);
        const data = await res.json();

        if (data.success) setJob(data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/recruiter/jobs/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Job deleted successfully");
        router.push("/recruiter");
      } else {
        alert("❌ Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <p className="text-white text-center mt-20 text-lg">Loading...</p>
    );
  }

  if (!job) {
    return (
      <p className="text-white text-center mt-20 text-lg">
        Job not found
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white py-12 px-6">

      <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1px] shadow-xl">

        <div className="bg-[#020617] rounded-3xl p-8">

          {/* 🔙 BACK */}
          <Link
            href="/recruiter"
            className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Jobs
          </Link>

          {/* 🔥 TITLE */}
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <p className="text-gray-400 mb-6">{job.company}</p>

          {/* 📊 INFO GRID */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-300">
            <p><span className="text-gray-500">📍 Location:</span> {job.location}</p>
            <p><span className="text-gray-500">💼 Type:</span> {job.jobType}</p>
            <p><span className="text-gray-500">⏳ Duration:</span> {job.duration}</p>
            <p><span className="text-gray-500">🏠 Mode:</span> {job.workMode}</p>
          </div>

          {/* 💰 STIPEND */}
          {job.stipend && (
            <div className="mb-4 text-gray-300">
              💰 ₹{job.stipend.min} - ₹{job.stipend.max} / month
            </div>
          )}

          {/* 📅 APPLY BY */}
          {job.applyBy && (
            <div className="mb-4 text-gray-300">
              📅 Apply By: {new Date(job.applyBy).toLocaleDateString()}
            </div>
          )}

          <div className="border-t border-white/10 my-6" />

          {/* 📘 ABOUT */}
          {job.about && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-blue-300">
                About Role
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {job.about}
              </p>
            </div>
          )}

          {/* 📌 SKILLS */}
          {job.skills?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-blue-300">
                Skills Required
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs border border-blue-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 🔥 ACTION BUTTONS */}
          <div className="flex gap-4 mt-8">

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
            >
              🗑 Delete Job
            </button>

           
          </div>

        </div>
      </div>
    </div>
  );
}