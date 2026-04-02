"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // 🔐 Not signed in
    if (!isSignedIn) {
      router.replace("/sign-in?redirect_url=/auth-redirect");
      return;
    }

    // ✅ Signed in → check resume
    async function checkUser() {
      try {
        const res = await fetch(`/api/user?clerkId=${user.id}`);
        const data = await res.json();

        if (data.hasResume) {
          router.replace("/login");
        } else {
          router.replace("/login/upload");
        }
      } catch (err) {
        console.error(err);
        router.replace("/login/upload");
      }
    }

    checkUser();
  }, [isLoaded, isSignedIn, user, router]);

  return null;
}