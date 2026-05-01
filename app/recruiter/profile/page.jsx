"use client";

import { Header } from "@/components/inside/Header";
import { useRouter } from "next/navigation";

export default function RecruiterProfile() {
  const router = useRouter();

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
              onClick={() => router.push("/recruiter/")}
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

            <button
              onClick={() => router.push("/recruiter/results")}
                className="btn-animate overflow-hidden block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5"
            >
              📊 Candidate Results
            </button>

            {/* ✅ ACTIVE */}
            <button
             className="block w-full  font-bold  fill-amber-400 text-2xl text-left  text-white/90 px-3 py-2 rounded-lg hover:bg-white/5   "
            >
               Profile
            </button>

          </nav>
        </aside>

        {/* 🔹 MAIN */}
       <main className="flex-1 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500">

  <h1 className="text-3xl font-bold text-blue-300 mb-8">
    Recruiter Profile
  </h1>

  {/* 🔥 PROFILE CARD */}
  <div className="rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1px] shadow-xl">
    <div className="rounded-3xl bg-[#020617] p-8">

      {/* HEADER */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
          S
        </div>

        <div>
          <h2 className="text-xl font-semibold">Sourav Singhal</h2>
          <p className="text-gray-400 text-sm">HR Manager @ HireByte</p>
        </div>
      </div>

      {/* 🔹 GRID */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* PERSONAL INFO */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">
            Personal Information
          </h3>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-400">Full Name</label>
              <input
                type="text"
                value="Sourav Singhal"
                readOnly
                className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-white/10"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Age</label>
              <input
                type="text"
                value="21"
                readOnly
                className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-white/10"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="text"
                value="sourav@gmail.com"
                readOnly
                className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-white/10"
              />
            </div>

          </div>
        </div>

        {/* COMPANY INFO */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">
            Company Information
          </h3>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-400">Company Name</label>
              <input
                type="text"
                value="HireByte"
                readOnly
                className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-white/10"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Company Email</label>
              <input
                type="text"
                value="hr@hirebyte.com"
                readOnly
                className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-white/10"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Role</label>
              <input
                type="text"
                value="HR Manager"
                readOnly
                className="w-full mt-1 p-3 rounded-lg bg-black/40 border border-white/10"
              />
            </div>

          </div>
        </div>

      </div>

      {/* 🔥 ACTION BUTTONS */}
      <div className="flex justify-end gap-4 mt-10">
        <button className="px-6 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition">
          Edit Profile
        </button>

        <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>

    </div>
  </div>

</main>
      </div>
    </div>
  );
}