"use client";

import { useState } from "react";
import { Header } from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const [count, setCount] = useState(0);
  const router = useRouter();
  const [mode, setMode] = useState("AI");
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    workMode: "",
    jobType: "",
    startDate: "",
    duration: "",
    min: "",
    max: "",
    about: "",
    responsibilities: "",
    requirements: "",
    skills: "",
  });

  const handleChange = (e) => {
    console.log("✏️ INPUT CHANGE:", e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    console.log("🔢 QUESTION COUNT:", val);
    setCount(val);
    setQuestions(Array(val).fill(""));
  };

  const handleQuestionChange = (i, value) => {
    const updated = [...questions];
    updated[i] = value;
    console.log(`❓ Q${i + 1}:`, value);
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    console.log("🚀 SUBMIT CLICKED");

    const payload = {
      ...form,

      stipend: {
        min: Number(form.min) || 0,
        max: Number(form.max) || 0,
        currency: "INR",
      },

      responsibilities: form.responsibilities
        ? form.responsibilities.split(",").map(i => i.trim()).filter(Boolean)
        : [],

      requirements: form.requirements
        ? form.requirements.split(",").map(i => i.trim()).filter(Boolean)
        : [],

      skills: form.skills
        ? form.skills.split(",").map(i => i.trim()).filter(Boolean)
        : [],

      no_of_questions: Number(count) || 0,

      questions:
        mode === "AI"
          ? []
          : questions.filter(q => q.trim() !== ""),

      questionMode: mode,
    };

    console.log("📦 FINAL PAYLOAD:", payload);

    try {
    const res = await fetch("/api/recruiter/pushjobs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // ✅ important
  body: JSON.stringify(payload),
});

      console.log("📡 RESPONSE STATUS:", res.status);

      const data = await res.json();
      console.log("📥 RESPONSE DATA:", data);

      if (data.success) {
        alert("✅ Job Created");
        router.push("/recruiter");
      } else {
        alert(`❌ Failed: ${data.error}`);
      }

    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      alert("Error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
      
      <Header />

      <div className="max-w-5xl mx-auto py-20 px-6">

        <h1 className="text-4xl font-bold text-blue-400 mb-10">
          🚀 Create Job Posting
        </h1>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-10">

          {/* BASIC */}
          <section className="grid md:grid-cols-2 gap-6">
            <input name="title" placeholder="Job Title" className="input" onChange={handleChange} />
            <input name="company" placeholder="Company" className="input" onChange={handleChange} />
            <input name="location" placeholder="Location" className="input" onChange={handleChange} />

            <select name="workMode" className="input" onChange={handleChange}>
              <option value="">Work Mode</option>
              <option value="WORK_FROM_HOME">WORK_FROM_HOME</option>
              <option value="OFFICE">OFFICE</option>
            </select>

            <select name="jobType" className="input" onChange={handleChange}>
              <option value="">Job Type</option>
              <option value="INTERNSHIP">INTERNSHIP</option>
              <option value="FULL_TIME">FULL_TIME</option>
            </select>

            <input name="startDate" placeholder="Start Date" className="input" onChange={handleChange} />
            <input name="duration" placeholder="Duration" className="input" onChange={handleChange} />
          </section>

          {/* STIPEND */}
          <section className="grid md:grid-cols-2 gap-6">
            <input name="min" type="number" placeholder="Min ₹" className="input" onChange={handleChange} />
            <input name="max" type="number" placeholder="Max ₹" className="input" onChange={handleChange} />
          </section>

          {/* DETAILS */}
          <section>
            <textarea name="about" placeholder="About" className="textarea" onChange={handleChange} />
            <textarea name="responsibilities" placeholder="Responsibilities (comma)" className="textarea" onChange={handleChange} />
            <textarea name="requirements" placeholder="Requirements (comma)" className="textarea" onChange={handleChange} />
          </section>

          {/* SKILLS */}
          <input name="skills" placeholder="Skills (comma)" className="input" onChange={handleChange} />

          {/* QUESTIONS */}
          <section>
            <h2 className="text-red-400 mb-4">🤖 Interview Questions</h2>

            <input type="number" placeholder="No of Questions" className="input mb-4" onChange={handleCountChange} />

            <select className="input mb-4" onChange={(e) => setMode(e.target.value)}>
              <option value="AI">Fully AI</option>
              <option value="MANUAL">Manual</option>
              <option value="HYBRID">Hybrid</option>
            </select>

            {mode !== "AI" &&
              questions.map((q, i) => (
                <input
                  key={i}
                  className="input mb-2"
                  placeholder={`Question ${i + 1}`}
                  value={q}
                  onChange={(e) => handleQuestionChange(i, e.target.value)}
                />
              ))
            }
          </section>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 px-8 py-3 rounded-xl hover:bg-blue-700"
          >
            Post Job
          </button>

        </div>
      </div>

      <style>{`
        .input {
          width:100%;
          padding:12px;
          border-radius:10px;
          background:rgba(0,0,0,0.4);
          border:1px solid rgba(255,255,255,0.1);
        }
        .textarea {
          width:100%;
          padding:12px;
          border-radius:10px;
          background:rgba(0,0,0,0.4);
          border:1px solid rgba(255,255,255,0.1);
          height:100px;
          margin-bottom:10px;
        }
      `}</style>

    </div>
  );
}