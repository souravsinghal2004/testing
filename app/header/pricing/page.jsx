
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
    <h1 className="text-5xl font-bold text-center mb-6">
          Pricing Plans
        </h1>

        <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          Choose a plan that fits your hiring needs. Whether you're a startup or a large enterprise, we have flexible solutions for you.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          {[
            {
              name: "Free",
              price: "₹0",
              desc: "Best for individuals testing the platform",
              features: ["1 Interview", "Basic AI Analysis", "Limited Support"]
            },
            {
              name: "Pro",
              price: "₹499/month",
              desc: "Perfect for startups and small teams",
              features: ["Unlimited Interviews", "Advanced Reports", "Priority Support"]
            },
            {
              name: "Enterprise",
              price: "Custom",
              desc: "For large companies with custom needs",
              features: ["Team Access", "Custom AI Models", "Dedicated Manager"]
            }
          ].map((plan, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">

              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-gray-400 mb-4">{plan.desc}</p>

              <p className="text-3xl font-bold mb-6 text-blue-400">
                {plan.price}
              </p>

              <ul className="space-y-2 text-gray-400 mb-6">
                {plan.features.map((f, idx) => (
                  <li key={idx}>✔ {f}</li>
                ))}
              </ul>

              <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl">
                Get Started
              </button>

            </div>
          ))}

        </div>

      </main>

      {/* 🔥 FOOTER (ALWAYS BOTTOM) */}
      <Footer />
    </div>
  );
}