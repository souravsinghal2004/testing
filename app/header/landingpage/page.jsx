import React from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  Plus, 
  Minus, 
  Twitter, 
  Linkedin, 
  Github 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">I</div>
          <span className="text-xl font-bold tracking-tight">InterviewPal</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition">Interview Questions</a>
          <a href="#" className="hover:text-white transition">Interview AI Tools</a>
          <a href="#" className="hover:text-white transition">Study Plans</a>
          <a href="#" className="hover:text-white transition">Job Search Tools</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium">Log In</button>
          <button className="bg-blue-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center px-4">
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64">
               {/* Replace with your local AI robot image */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10" />
              <img 
                src="/ai-hero.png" 
                alt="AI Robot" 
                className="w-full h-full object-contain opacity-80"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Nail Every <span className="text-blue-500">Interview</span> Question.<br />
            Land Every Job Offer.
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Eliminate the chaos of hiring. From sourcing to screening to scheduling. 
            AI-powered platform streamlines engagement across SMS, email, chat, voice, and phone.
          </p>

          <div className="flex flex-col sm:row items-center justify-center gap-4">
            <button className="bg-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition w-full sm:w-auto">
              Get a Demo
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition w-full sm:w-auto">
              AI Done Right
            </button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-y border-white/5">
        <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-widest">Grow Your Chain Expand Boundlessly</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition duration-500">
           {/* Placeholder for crypto/company logos */}
           {['Sei', 'Aptos', 'Blast', 'Near', 'Flow', 'Solana', 'Olas', 'Avalanche'].map((name) => (
             <span key={name} className="font-bold text-xl">{name}</span>
           ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Perfect Your Interview Answers with AI</h2>
          <p className="text-gray-400">Helping candidates land offers at 500+ leading companies worldwide.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Stats */}
          <div className="col-span-1 lg:col-span-2 bg-[#0f172a]/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-48 h-48 rounded-full border-[10px] border-blue-600/20 border-t-blue-500 flex items-center justify-center relative">
                    <span className="text-2xl font-bold">85%</span>
                    <p className="absolute -bottom-4 text-[10px] bg-blue-600 px-2 py-1 rounded">Improvement</p>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-2">AI Weekly Insights</h3>
                    <p className="text-gray-400">Weekly progress report. Track your improvements, strengths, and areas to focus on.</p>
                </div>
            </div>
          </div>

          {/* Card 2 - Profile */}
          <div className="bg-[#0f172a]/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-2">Resume AI</h3>
            <p className="text-gray-400 text-sm mb-6">Get valuable feedback from your AI-Powered Interview Coach.</p>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <p className="font-bold">Nadia Quiva</p>
                <p className="text-xs text-gray-500">Product Designer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-blue-900/10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Choose The Perfect Plan</h2>
          <p className="text-gray-400 mb-12">Flexible pricing plans tailored to your needs.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#0f172a]/80 border border-white/10 p-8 rounded-3xl flex flex-col text-left">
              <h4 className="text-xl font-bold mb-2">Free</h4>
              <div className="text-4xl font-bold mb-6">$0<span className="text-sm text-gray-500">/month</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-blue-500" /> Get 5 credits daily</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-blue-500" /> Basic job AI search</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-blue-500" /> Limited Weekly AI insights</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition">Get a consultation</button>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-600/10 border-2 border-blue-500 p-8 rounded-3xl flex flex-col text-left relative transform lg:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-xs font-bold px-4 py-1 rounded-full uppercase">Most Popular</div>
              <h4 className="text-xl font-bold mb-2">Pro</h4>
              <div className="text-4xl font-bold mb-6">$11.99<span className="text-sm text-gray-500">/month</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-blue-500" /> Unlimited credits</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-blue-500" /> Full access to company logs</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-blue-500" /> Interview GPT access</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition">Get started</button>
            </div>

            {/* Custom Plan */}
            <div className="bg-[#0f172a]/80 border border-white/10 p-8 rounded-3xl flex flex-col text-left">
              <h4 className="text-xl font-bold mb-2">Custom Plan</h4>
              <div className="text-2xl font-bold mb-6">Request a quote</div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-blue-500" /> Custom interview modules</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle className="w-4 h-4 text-blue-500" /> Personalized performance tracker</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition">Contact sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            "What is InterviewPal?",
            "How is InterviewPal different from a coach?",
            "What kind of feedback will I receive?",
            "Can I practice with both audio and video?",
          ].map((q, i) => (
            <div key={i} className="border-b border-white/10 py-6 flex justify-between items-center cursor-pointer group">
              <span className="text-lg text-gray-300 group-hover:text-white transition">{q}</span>
              <Plus className="w-5 h-5 text-gray-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">I</div>
              <span className="text-xl font-bold">InterviewPal</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your interview success partner, offering personalized tools to give you the edge.
            </p>
            <div className="flex gap-4 mt-6">
               <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
               <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
               <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-wider">Account</h5>
            <ul className="text-gray-500 space-y-4 text-sm">
              <li>Dashboard</li>
              <li>Subscription</li>
              <li>Settings</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-wider">Interview Tools</h5>
            <ul className="text-gray-500 space-y-4 text-sm">
              <li>Interview GPT</li>
              <li>Resume AI</li>
              <li>Job AI</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-wider">Support</h5>
            <ul className="text-gray-500 space-y-4 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
          © 2026 InterviewPal. All rights reserved. 123 Madison Ave, New York, NY 10016.
        </div>
      </footer>
    </div>
  );
}