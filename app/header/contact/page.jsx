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
     <div className="max-w-4xl mx-auto">

          <h1 className="text-5xl font-bold mb-6 text-center">
            Contact Us
          </h1>

          <p className="text-center text-gray-400 mb-12">
            Have questions or need support? Reach out to us and our team will get back to you.
          </p>

          <form className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 space-y-6">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg bg-black/40 border border-white/10"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-lg bg-black/40 border border-white/10"
            />

            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/10"
            />

            <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl">
              Send Message
            </button>

          </form>

          {/* EXTRA */}
          <div className="mt-12 text-center text-gray-400">
            <p>Email: support@aiinterview.com</p>
            <p>Response time: Within 24 hours</p>
          </div>

        </div>
        
      </main>

      {/* 🔥 FOOTER (ALWAYS BOTTOM) */}
      <Footer />
    </div>
  );
}