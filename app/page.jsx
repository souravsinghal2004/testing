"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";  
import Navbar from "@/components/Navbar";
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import JobsPreview from "@/components/JobsPreview";

import Testimonials from "@/components/Testimonials";
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

export default function Page() {


    const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

 useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // 🔥 IMPORTANT CHANGE
      router.replace("/auth-redirect");
    }
  }, [isLoaded, isSignedIn, router]);

  // ⛔ Prevent UI flash before redirect
  if (!isLoaded || isSignedIn) return null;

   return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen bg-[#05060f] text-white"
    >
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
    
      <Testimonials />
      <CTA />
     
      <Footer />
    </motion.main>
  )
}