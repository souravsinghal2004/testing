"use client";

import { useState } from "react";
import { Header } from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();

  const [mode, setMode] = useState("AI");
  const [count, setCount] = useState(0);
  const [questions, setQuestions] = useState([]);

  const [durationType, setDurationType] = useState("months");

  const [stipendUnit, setStipendUnit] = useState("thousand");

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setCount(val);
    setQuestions(Array(val).fill(""));
  };

  const handleQuestionChange = (i, value) => {
    const updated = [...questions];
    updated[i] = value;
    setQuestions(updated);
  };

  /* 🔥 STIPEND CONVERTER */
  const convertToINR = (value) => {
    const num = Number(value) || 0;

    if (stipendUnit === "thousand") return num * 1000;
    if (stipendUnit === "lakh") return num * 100000;
    if (stipendUnit === "crore") return num * 10000000;

    return num;
  };

  const handleSubmit = async () => {
  console.log("🚀 SUBMIT CLICKED");

  // ✅ VALIDATION
  if (!form.title || !form.company) {
    alert("Title & Company required");
    return;
  }

  if (!form.workMode || !form.jobType) {
    alert("Select Work Mode & Job Type");
    return;
  }

  const payload = {
    ...form,

    // ✅ FIXED DATE
    startDate: form.startDate || " ",

    // ✅ SAFE DURATION
    duration: form.duration
      ? `${form.duration} ${durationType}`
      : "",

    stipend: {
      min: convertToINR(form.min),
      max: convertToINR(form.max),
      currency: "INR",
    },

    responsibilities: form.responsibilities
      ?.split(",")
      .map(i => i.trim())
      .filter(Boolean) || [],

    requirements: form.requirements
      ?.split(",")
      .map(i => i.trim())
      .filter(Boolean) || [],

    skills: form.skills
      ?.split(",")
      .map(i => i.trim())
      .filter(Boolean) || [],

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
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Job Created");
      router.push("/recruiter");
    } else {
      alert(`❌ ${data.error}`);
    }

  } catch (err) {
    console.error("❌ ERROR:", err);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white overflow-y-scroll hide-scroll">

     <div className="fixed top-0 left-0 w-full z-50">
  <Header />
</div>

     <div className="h-full overflow-y-scroll hide-scroll pt-24 px-6">

        <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-400 mb-10">
          🚀 Create Job Posting
        </h1>

        <div className="bg-white/5 p-8 rounded-3xl space-y-10">

          {/* BASIC */}
          <section className="grid md:grid-cols-2 gap-6">
            <input name="title" placeholder="Job Title" className="input" onChange={handleChange} />
            <input name="company" placeholder="Company" className="input" onChange={handleChange} />
            <input name="location" placeholder="Location" className="input" onChange={handleChange} />

            <select name="workMode" className="input" onChange={handleChange}>
            <option value="">Select Work Mode</option>
<option value="WORK_FROM_HOME">Remote</option>
<option value="ONSITE">Office</option>
<option value="HYBRID">Hybrid</option>
            </select>

            <select name="jobType" className="input" onChange={handleChange}>
             <option value="">Select Job Type</option>
<option value="INTERNSHIP">Internship</option>
<option value="FULL_TIME">Full Time</option>
            </select>

            {/* 🔥 DATE PICKER */}
        <input
  type="text"
  placeholder="Start Date"
  className="input cursor-pointer"
  onFocus={(e) => (e.target.type = "date")}
  onBlur={(e) => {
    if (!e.target.value) e.target.type = "text";
  }}
  onChange={handleChange}
/>

            {/* 🔥 DURATION */}
            <div className="flex gap-2">
              <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  name="duration"
  placeholder="Duration"
  className="input"
  onChange={handleChange}
/>

              <select
                className="input"
                value={durationType}
                onChange={(e) => setDurationType(e.target.value)}
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>

          </section>

          {/* 🔥 STIPEND */}
          <section>
            <h2 className="text-green-400 mb-3">💰 Stipend</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="number"
                name="min"
                placeholder="Min Amount"
                className="input"
                onChange={handleChange}
              />

              <input
                type="number"
                name="max"
                placeholder="Max Amount"
                className="input"
                onChange={handleChange}
              />

             

              <select
                className="input"
                value={stipendUnit}
                onChange={(e) => setStipendUnit(e.target.value)}
              >
                <option value="thousand">Thousand (K)</option>
                <option value="lakh">Lakh (L)</option>
                <option value="crore">Crore (Cr)</option>
              </select>

               <p className="text-sm text-gray-400">
  Final: ₹{convertToINR(form.min)} - ₹{convertToINR(form.max)}
</p>
            </div>
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
      </div>

      <style>{`
      .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

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