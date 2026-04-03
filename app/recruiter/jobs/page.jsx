"use client";

import { Header } from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
    const router = useRouter();
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
           
           <Header />
     
           <div className="flex h-[calc(100vh-64px)]">
     
             {/* 🔹 SIDEBAR */}
            
    <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 px-6 py-8">
          <h2 className="text-xl font-bold text-blue-400 mb-8">
            Recruiter Panel
          </h2>

          <nav className="space-y-4">

            <button
             onClick={() => router.push("/recruiter")}
              className="block w-full text-left font-semibold hover:text-blue-400"
            >
              ➕ Post New Job
            </button>

            <button
             
              className="block w-full text-left text-blue-400"
            >
              📋 Your Jobs
            </button>

            <button
              onClick={() => router.push("/recruiter/results")}
              className="block w-full text-left hover:text-blue-400"
            >
              📊 Candidate Results
            </button>

            <button
              onClick={() => router.push("/recruiter/profile")}
              className="block w-full text-left hover:text-blue-400"
            >
              👤 Profile
            </button>
          </nav>
        </aside>
               {/* 🔹 MAIN */ }
               <main className="flex-1 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500">
                yor jobs
                   </main>
           </div>
           </div>

  );
}