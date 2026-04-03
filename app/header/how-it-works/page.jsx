
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
    
        <h1 className="text-5xl font-bold text-center mb-16">
          How It Works
        </h1>

        <div className="max-w-6xl mx-auto space-y-12">

          {[
            {
              title: "Create Job Listing",
              desc: "Recruiters define job roles, requirements, and interview questions tailored to their hiring needs."
            },
            {
              title: "Candidate Joins Interview",
              desc: "Candidates enter a live AI interview with voice and camera enabled for real-time interaction."
            },
            {
              title: "AI Conducts Interview",
              desc: "Our AI asks structured and adaptive questions based on job requirements and candidate responses."
            },
            {
              title: "Performance Analysis",
              desc: "The system evaluates communication, technical skills, confidence, and response quality."
            },
            {
              title: "Detailed Report Generated",
              desc: "Recruiters receive a complete breakdown including strengths, weaknesses, and hiring recommendations."
            }
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10"
            >
              <h2 className="text-2xl font-semibold mb-3">
                Step {i + 1}: {step.title}
              </h2>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}

        </div>
      </main>

      {/* 🔥 FOOTER (ALWAYS BOTTOM) */}
      <Footer />
    </div>
  );
}