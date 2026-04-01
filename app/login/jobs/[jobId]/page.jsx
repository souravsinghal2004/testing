import { connectDB } from "@/app/lib/mongo";
import Job from "@/app/models/Job";
import { notFound } from "next/navigation";
import Link from "next/link";
import InterviewButton from "./InterviewButton";

export default async function JobDetailsPage({ params }) {
  await connectDB();

  // ✅ REQUIRED in Next.js 16
  const { jobId } = await params;

  console.log("PARAM ID:", jobId);

  // since you're using Mongo _id in URL
  const job = await Job.findById(jobId).lean();

  if (!job) {
    console.log("JOB NOT FOUND IN DB");
    return notFound();
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white py-12 px-6">

    <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1px] shadow-xl">

      <div className="bg-[#020617] rounded-3xl p-8">

        {/* 🔙 BACK */}
        <Link
          href="/login"
          className="text-sm text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          ← Back to Jobs
        </Link>

        {/* 🔥 TITLE */}
        <h1 className="text-3xl font-bold mb-2 text-white">
          {job.title}
        </h1>
        <p className="text-gray-400 mb-6">{job.company}</p>

        {/* 🔹 BASIC INFO */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-gray-300 text-sm">
          <p><span className="text-gray-500">Location:</span> {job.location}</p>
          <p><span className="text-gray-500">Type:</span> {job.jobType}</p>
          <p><span className="text-gray-500">Start:</span> {job.startDate}</p>
          <p><span className="text-gray-500">Duration:</span> {job.duration}</p>
        </div>

        {/* 💰 STIPEND */}
        {job.stipend && (
          <div className="mb-3 text-gray-300">
            <span className="text-gray-500">Stipend:</span>{" "}
            ₹{job.stipend?.min} - ₹{job.stipend?.max} / month
          </div>
        )}

        {/* 📅 APPLY BY */}
        {job.applyBy && (
          <div className="mb-4 text-gray-300">
            <span className="text-gray-500">Apply By:</span>{" "}
            {new Date(job.applyBy).toLocaleDateString()}
          </div>
        )}

        {/* 👥 APPLICANTS */}
        {job.applicants !== undefined && (
          <p className="mb-6 text-gray-500 text-sm">
            {job.applicants}+ applicants
          </p>
        )}

        <div className="border-t border-white/10 my-6" />

        {/* 📘 ABOUT */}
        {job.about && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2 text-blue-300">
              About the Role
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {job.about}
            </p>
          </div>
        )}

        {/* 📌 RESPONSIBILITIES */}
        {job.responsibilities?.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2 text-blue-300">
              Responsibilities
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 📌 REQUIREMENTS */}
        {job.requirements?.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2 text-blue-300">
              Requirements
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-300">
              {job.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 🧠 SKILLS */}
        {job.skills?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-3 text-blue-300">
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

        {/* 🚀 BUTTON */}
        <div className="mt-8">
          <InterviewButton job={job} />
        </div>

      </div>
    </div>
  </div>
);
}