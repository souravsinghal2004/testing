"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export function useCheckInterview(jobId) {
  const { user } = useUser();

  const [alreadyGiven, setAlreadyGiven] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !jobId) return;

    const check = async () => {
      try {
        const res = await fetch(
          `/api/loggedinuserreport?userId=${user.id}&jobId=${jobId}`
        );

        const data = await res.json();

        if (data.length > 0) {
          setAlreadyGiven(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [user, jobId]);

  return { alreadyGiven, loading };
}