"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/inside/Header";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();

  const [mode, setMode] = useState("AI");
  const [count, setCount] = useState(2);
  const [questions, setQuestions] = useState(Array(2).fill(""));

  const [durationType, setDurationType] = useState("months");
  const [stipendUnit, setStipendUnit] = useState("thousand");
  const [ctc, setCtc] = useState("");

  const locations = [
    "Delhi", "Noida", "Gurgaon", "Chennai", "Hyderabad", 
    "Pune", "Ahmedabad", "Bengaluru", "Other",
  ];

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
  workMode: "WORK_FROM_HOME",
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
    const { name, value } = e.target;
    // For min/max/duration, prevent negative values
    if (["min", "max", "duration"].includes(name)) {
      if (value !== "" && Number(value) < 0) return;
    }
    setForm({ ...form, [name]: value });
  };

  // Common function to block non-numeric keys (e, +, -, .)
  const blockInvalidChar = (e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  const handleCountChange = (e) => {
    const val = Number(e.target.value);
    setCount(val);
    setQuestions(Array(val).fill(""));
  };

  const handleQuestionChange = (i, value) => {
    const updated = [...questions];
    updated[i] = value;
    setQuestions(updated);
  };

  const convertToINR = (value) => {
    const num = Math.max(0, Number(value) || 0);
    if (stipendUnit === "thousand") return num * 1000;
    if (stipendUnit === "lakh") return num * 100000;
    return num;
  };

  const handleSubmit = async () => {
    if (!form.title || !form.company || !form.jobType) {
      alert("Please fill Title, Company, and Job Type");
      return;
    }

    const payload = {
      ...form,
      duration: form.jobType === "INTERNSHIP" ? `${form.duration} ${durationType}` : "",
      stipend: form.jobType === "INTERNSHIP" ? {
        min: convertToINR(form.min),
        max: convertToINR(form.max),
        currency: "INR",
      } : null,
      ctc: form.jobType === "FULL_TIME" ? (Number(ctc) * 100000) : null,
      responsibilities: form.responsibilities?.split(",").map(i => i.trim()).filter(Boolean) || [],
      requirements: form.requirements?.split(",").map(i => i.trim()).filter(Boolean) || [],
      skills: form.skills?.split(",").map(i => i.trim()).filter(Boolean) || [],
      no_of_questions: count,
      questions: mode === "AI" ? [] : questions.filter(q => q.trim() !== ""),
      questionMode: mode,
    };

    try {
      const res = await fetch("/api/recruiter/pushjobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Job Created Successfully");
        router.push("/recruiter");
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen              bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white overflow-y-auto hide-scroll">
      <Header />

      <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-400 mb-10"> Create Job Posting</h1>

        <div className="bg-white/5 p-8 rounded-3xl space-y-10 border border-white/10 backdrop-blur-sm">
          
          <section className="grid md:grid-cols-2 gap-6  ">
            <input name="title" placeholder="Job Title" className="input card-hover card-glow card-lift card-border cursor-pointer card-hover card-glow card-lift card-border cursor-pointer" onChange={handleChange} />
            <input name="company" placeholder="Company Name" className="input card-hover card-glow card-lift card-border cursor-pointer card-hover card-glow card-lift card-border cursor-pointer" onChange={handleChange} />
            
            <select name="location" className="input card-hover card-glow card-lift card-border cursor-pointer card-hover card-glow card-lift card-border cursor-pointer" onChange={handleChange}>
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select name="jobType" className="input card-hover card-glow card-lift card-border cursor-pointer" onChange={handleChange}>
              <option value="">Select Job Type</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FULL_TIME">Full Time</option>
            </select>

            <input
              type="text"
              placeholder="Start Date"
              className="input card-hover card-glow card-lift card-border cursor-pointer"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => !e.target.value && (e.target.type = "text")}
              onChange={handleChange}
              name="startDate"
            />

            <select 
  name="workMode" 
  className="input card-hover card-glow card-lift card-border cursor-pointer" 
  onChange={handleChange}
  value={form.workMode} // Recommended: bind value to state
>
  <option value="WORK_FROM_HOME">Remote</option>
  <option value="ONSITE">In Office</option>
  <option value="HYBRID">Hybrid</option>
</select>
          </section>

          {/* DYNAMIC FIELDS: INTERNSHIP */}
          {form.jobType === "INTERNSHIP" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex gap-2">
                <input 
                    name="duration" 
                    type="number" 
                    onKeyDown={blockInvalidChar}
                    placeholder="Duration" 
                    className="input card-hover card-glow card-lift card-border cursor-pointer no-spinner" 
                    onChange={handleChange} 
                />
                <select className="input card-hover card-glow card-lift card-border cursor-pointer w-1/3" value={durationType} onChange={(e) => setDurationType(e.target.value)}>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <input 
                    name="min" 
                    type="number" 
                    onKeyDown={blockInvalidChar}
                    placeholder="Min Stipend" 
                    className="input card-hover card-glow card-lift card-border cursor-pointer no-spinner" 
                    onChange={handleChange} 
                />
                <input 
                    name="max" 
                    type="number" 
                    onKeyDown={blockInvalidChar}
                    placeholder="Max Stipend" 
                    className="input card-hover card-glow card-lift card-border cursor-pointer no-spinner" 
                    onChange={handleChange} 
                />
                <select className="input card-hover card-glow card-lift card-border cursor-pointer" value={stipendUnit} onChange={(e) => setStipendUnit(e.target.value)}>
                  <option value="thousand">Thousand /mo</option>
                  <option value="lakh">Lakh /mo</option>
                </select>
              </div>
            </div>
          )}

          {/* DYNAMIC FIELDS: FULL TIME */}
          {form.jobType === "FULL_TIME" && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-purple-400 mb-3 font-medium">💼 Annual CTC (in Lakhs)</h2>
              <input
                type="number"
                onKeyDown={blockInvalidChar}
                placeholder="e.g. 12 (for 12 LPA)"
                className="input card-hover card-glow card-lift card-border cursor-pointer no-spinner"
                value={ctc}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || Number(val) >= 0) setCtc(val);
                }}
              />
            </div>
          )}

          {/* PREVIEW CARD */}
          {form.jobType && (
            <div className="p-4 rounded-xl bg-black/40 border border-blue-500/30">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Offer Preview</h3>
              {form.jobType === "INTERNSHIP" ? (
                <p className="text-green-400 font-semibold text-lg">
                  ₹{convertToINR(form.min).toLocaleString()} – ₹{convertToINR(form.max).toLocaleString()} / month
                </p>
              ) : (
                <p className="text-purple-400 font-semibold text-lg">
                  ₹{(Number(ctc) * 100000).toLocaleString()} / year (CTC)
                </p>
              )}
            </div>
          )}

          <section className="space-y-4">
            <textarea name="about" placeholder="About the Role" className="textarea card-hover card-glow card-lift card-border cursor-pointer" onChange={handleChange} />
            <textarea name="responsibilities" placeholder="Responsibilities (comma separated)" className="textarea card-hover card-glow card-lift card-border cursor-pointer" onChange={handleChange} />
            <textarea name="requirements" placeholder="Requirements (comma separated)" className="textarea card-hover card-glow card-lift card-border cursor-pointer  " onChange={handleChange} />
            <input name="skills" placeholder="Required Skills (comma separated)" className="input card-hover card-glow card-lift card-border cursor-pointer roun" onChange={handleChange} />
          </section>

          <section className="p-6 bg-red-500/5 rounded-2xl border border-red-500/10">
            <h2 className="text-red-400 mb-4 font-bold">🤖 Interview Settings</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <select className="input card-hover card-glow card-lift card-border cursor-pointer" value={count} onChange={handleCountChange}>
                {[2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n} Questions</option>)}
              </select>
              <select className="input card-hover card-glow card-lift card-border cursor-pointer" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="AI">Fully AI Generated</option>
                <option value="MANUAL">Manual Entry</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            {mode !== "AI" && (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <input key={i} className="input card-hover card-glow card-lift card-border cursor-pointer" placeholder={`Question ${i + 1}`} value={q} onChange={(e) => handleQuestionChange(i, e.target.value)} />
                ))}
              </div>
            )}
          </section>

          <button onClick={handleSubmit} className=" card-hover card-glow card-lift card-border cursor-pointer rounded-3xl  w-full bg-blue-900 hover:bg-blue-800 text-white font-bold px-12 py-4 rounded-2xl transition-all">
            Post Job Now
          </button>
        </div>
      </div>

      <style jsx>{`
        .hide-scroll::-webkit-scrollbar { display:none; }
        
        /* Hide Arrows/Spinners */
        .no-spinner::-webkit-inner-spin-button, 
        .no-spinner::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .no-spinner { -moz-appearance: textfield; }

        .input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          outline: none;
        }
        .textarea {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          height: 120px;
          outline: none;
        }
      `}</style>
    </div>
  );
}