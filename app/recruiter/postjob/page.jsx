"use client";

import { Header } from "@/components/Navbar";

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
      
      <Header />

      <div className="max-w-5xl mx-auto py-20 px-6">

        <h1 className="text-4xl font-bold text-blue-400 mb-10">
          🚀 Create Job Posting
        </h1>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-10">

          {/* 🔹 BASIC INFO */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-300">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <input placeholder="Job Title" className="input" />
              <input placeholder="Company Name" className="input" />

              <input placeholder="Location" className="input" />

              <select className="input">
                <option>Work Mode</option>
                <option>WORK_FROM_HOME</option>
                <option>OFFICE</option>
                <option>HYBRID</option>
              </select>

              <select className="input">
                <option>Job Type</option>
                <option>INTERNSHIP</option>
                <option>FULL_TIME</option>
                <option>PART_TIME</option>
              </select>

              <input placeholder="Start Date (e.g. Immediately)" className="input" />
              <input placeholder="Duration (e.g. 2 Months)" className="input" />

            </div>
          </section>

          {/* 🔹 STIPEND */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              💰 Stipend
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <input type="number" placeholder="Minimum ₹" className="input" />
              <input type="number" placeholder="Maximum ₹" className="input" />
            </div>
          </section>

          {/* 🔹 DESCRIPTION */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-purple-400">
              📄 Job Details
            </h2>

            <textarea placeholder="About the Job" className="textarea" />

            <textarea placeholder="Responsibilities (comma separated)" className="textarea" />

            <textarea placeholder="Requirements (comma separated)" className="textarea" />

            <textarea placeholder="Good To Have (comma separated)" className="textarea" />

            <textarea placeholder="Benefits (comma separated)" className="textarea" />
          </section>

          {/* 🔹 SKILLS */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              🧠 Skills Required
            </h2>

            <input
              placeholder="e.g. React, Node.js, Communication"
              className="input"
            />
          </section>

          {/* 🔹 AI QUESTIONS */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-red-400">
              🤖 Interview Questions
            </h2>

            <div className="space-y-4">
              <input placeholder="Question 1" className="input" />
              <input placeholder="Question 2" className="input" />
              <input placeholder="Question 3" className="input" />
            </div>
          </section>

          {/* 🔥 SUBMIT */}
          <div className="flex justify-end">
            <button className="bg-blue-600 px-8 py-3 rounded-xl hover:bg-blue-700 transition text-lg font-semibold">
              Post Job
            </button>
          </div>

        </div>
      </div>

      {/* 🔥 COMMON INPUT STYLES */}
      <style>
        {`
          .input {
            width: 100%;
            padding: 12px;
            border-radius: 10px;
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
          }

          .textarea {
            width: 100%;
            padding: 12px;
            border-radius: 10px;
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
            height: 100px;
            margin-bottom: 16px;
          }
        `}
      </style>

    </div>
  );
}