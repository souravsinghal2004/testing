"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/inside/Header";

export default function UserDashboardPage() {

  const { isLoaded, isSignedIn, user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
const [animate, setAnimate] = useState(false);

useEffect(() => {
  setAnimate(false); // reset
  const timeout = setTimeout(() => setAnimate(true), 50); // trigger again
  return () => clearTimeout(timeout);
}, []);



  /* 🔥 SINGLE CLEAN EFFECT (no duplicate calls) */
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    async function init() {
      try {
        // 1️⃣ Get user data
        const userRes = await fetch(`/api/user?clerkId=${user.id}`);
        const userData = await userRes.json();

        // 2️⃣ Wait until keywords exist
        if (!userData?.keywords || userData.keywords.length === 0) {
          console.log("Waiting for keywords...");
          return;
        }

        // 3️⃣ Fetch jobs
        const res = await fetch(`/api/jobs?userId=${user.id}`);
        const data = await res.json();

        setJobs(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [isLoaded, isSignedIn, user]);

  /* 🔥 SAVE USER (runs once) */
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    async function saveUser() {
      try {
        await fetch("/api/save-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`,
            email: user.primaryEmailAddress?.emailAddress,
          }),
        });
      } catch (err) {
        console.error("User save failed", err);
      }
    }

    saveUser();
  }, []); // ✅ run once only

  if (!isLoaded || !isSignedIn) return null;

  return (
   <div className="h-screen overflow-hidden              bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
  <Header />

  <div className="flex h-[calc(100vh-64px)]">  
        {/* Sidebar */}
         <aside className="fade-in w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 px-6 py-8">
          <h2 className="text-xl font-bold text-blue-400 mb-8">
            Candidate Panel
          </h2>

          <nav className="space-y-4">
            <button
            
         
              className="block w-full  font-bold  fill-amber-400 text-2xl text-left  text-white/90 px-3 py-2 rounded-lg hover:bg-white/5   "
            >
               Available Jobs
            </button>

            <button
              onClick={() => router.push("/login/results")}
               className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              📊 Interview Results
            </button>

            <button    
            onClick={() => router.push("/login/feedback")}
               className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">
             
              🧠 Skill Feedback
            </button>

         <button
  onClick={() => router.push("/login/profile")}
  className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
>
  📄 Profile
</button>
          </nav>
        </aside>

        {/* Main Content */}
        
            <main className="flex-1 p-10 overflow-y-auto ">
<h1
  className={`text-3xl font-bold mb-6 text-blue-300 drop ${
    animate ? "animate" : ""
  }`}
>
  Welcome, {user?.firstName || "Candidate"}
</h1>

          {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {loading ? (
    <p className="text-white">Loading jobs...</p>
  ) : jobs.length === 0 ? (
    <p className="text-white">No jobs available.</p>
  ) : (
   jobs.map((job, i) => (
 <div
  key={job._id}
  style={{ animationDelay: `${i * 0.1}s` }}
  className={`drop ${animate ? "animate" : ""}`}
>
  <div className="card-hover card-glow card-lift card-border  rounded-3xl ">

  <div className="rounded-3xl bg-[#020617] p-6 text-white">
    {/* content */}


      
          {/* 🔥 HEADER */}
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

          {/* 🔹 SUMMARY */}
          {job.about && (
            <p className="text-gray-300 mb-4 line-clamp-3">
              {job.about}
            </p>
          )}

          {/* 🔹 GRID INFO */}
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

          {/* 🔹 SKILLS */}
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

          {/* 🔹 FOOTER */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              AI Matched Job
            </span>

           <Link
  href={`/login/jobs/${job._id}`}
  className=" view-btn bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
>
  View Job
</Link>
          </div>
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
