import Footer from "@/components/Footer";
import { Header } from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">

      {/* 🔥 FIXED HEADER */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* 🔥 SCROLLBAR HIDE STYLE */}
      <style>
        {`
          .hide-scroll::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* 🔥 MAIN SCROLL AREA */}
      <main
        className="flex-1 overflow-y-scroll hide-scroll px-6 md:px-20 py-24"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >

        {/* 🔥 YOUR CONTENT START */}
       <div className="max-w-6xl mx-auto">

          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About Our AI Interview Platform
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Hiring the right candidate has always been one of the biggest challenges for companies...
          </p>

          <p className="text-gray-400 leading-relaxed mb-10">
            Our platform leverages cutting-edge artificial intelligence...
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-semibold mb-3">🚀 Our Mission</h2>
              <p className="text-gray-400">
                To eliminate inefficiencies in hiring...
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-semibold mb-3">🎯 Our Vision</h2>
              <p className="text-gray-400">
                To become the global standard...
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-semibold mb-3">🤖 What We Do</h2>
              <p className="text-gray-400">
                We simulate real interviews...
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
            <ul className="space-y-3 text-gray-400">
              <li>✔ AI-driven real-time interview experience</li>
              <li>✔ Automated candidate evaluation reports</li>
              <li>✔ Saves 80% recruiter time</li>
              <li>✔ Scalable for startups to enterprises</li>
            </ul>
          </div>

        </div>
      </main>

      {/* 🔥 FOOTER (ALWAYS BOTTOM) */}
      <Footer />
    </div>
  );
}