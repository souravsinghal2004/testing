"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
 

    if (!isLoaded) {
     
      return;
    }

  

    if (!isSignedIn) {
    
      router.replace("/sign-in?redirect_url=/auth-redirect");
      return;
    }

  
    async function handleFlow() {
      try {
     

        const res = await fetch(`/api/user?clerkId=${user.id}`);
        
        const data = await res.json();

      
        // 🔥 NORMALIZE ROLE (IMPORTANT)
        const role = data?.role?.trim().toUpperCase();


        // 🔥 ROLE CHECK
        if (role === "RECRUITER") {
        
          router.replace("/recruiter");
          return;
        } else {
         
        }


        if (data?.hasResume) {
     
          router.replace("/login"); // TEMP
        } else {
        
          router.replace("/login/upload");
        }

      } catch (err) {
       
        router.replace("/login/upload");
      }
    }

    handleFlow();
  }, [isLoaded, isSignedIn, user, router]);

   return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-10 py-8 rounded-2xl text-center shadow-xl">

        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-400 mx-auto mb-4"></div>

        <p className="text-gray-300">Loading...</p>

      </div>

    </div>
  );
}