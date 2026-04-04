"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckRolePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    // ❌ Not signed in
    if (!isSignedIn) {
      console.log("❌ Not signed in");
      router.replace("/sign-in");
      return;
    }

    async function checkRole() {
      try {
        console.log("🔍 Fetching user role...");

        const res = await fetch(`/api/user?clerkId=${user.id}`);
        const data = await res.json();

        console.log("✅ USER DATA:", data);

        // 🔥 ROLE BASED REDIRECT
        if (data?.role === "RECRUITER") {
          console.log("🚀 Recruiter → /recruiter");
          router.replace("/recruiter");
          return;
        }

        if (data?.role === "CANDIDATE") {
          console.log("🚀 Candidate flow");

          // 👉 Resume check bhi yahi kar
          if (data?.hasResume) {
            router.replace("/login");
          } else {
            router.replace("/login/upload");
          }

          return;
        }

        // ⚠️ Fallback
        console.log("⚠️ No role found → default upload");
        router.replace("/login/upload");

      } catch (err) {
        console.error("❌ Error:", err);
        router.replace("/login/upload");
      } finally {
        setLoading(false);
      }
    }

    checkRole();
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="h-screen flex items-center justify-center text-white bg-black">
      <p className="text-lg animate-pulse">
        Checking your profile...
      </p>
    </div>
  );
}