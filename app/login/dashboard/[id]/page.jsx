"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const params = useParams();
const jobId = params.id; // ✅ FIXED
console.log("PARAMS:", params);

  const { user, isLoaded } = useUser();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔥 DASHBOARD LOADED");

    console.log("👤 USER OBJECT:", user);
    console.log("🆔 USER ID:", user?.id);
    console.log("💼 JOB ID FROM URL:", jobId);

    if (!isLoaded) {
      console.log("⏳ Clerk not loaded yet...");
      return;
    }

    if (!user) {
      console.log("❌ No user found");
      return;
    }

    if (!jobId) {
      console.log("❌ No jobId found in params");
      return;
    }

    const fetchReport = async () => {
      try {
        console.log("📡 Calling API...");

        const url = `/api/loggedinuserreport?userId=${user.id}&jobId=${jobId}`;
        console.log("🌐 API URL:", url);

        const res = await fetch(url);

        console.log("📥 RESPONSE STATUS:", res.status);

        const reports = await res.json();

        console.log("📊 API RESPONSE DATA:", reports);

        if (Array.isArray(reports) && reports.length > 0) {
          console.log("✅ REPORT FOUND:", reports[0]);
          setData(reports[0]);
        } else {
          console.log("❌ NO REPORT FOUND FOR THIS USER + JOB");
          setData(null);
        }
      } catch (err) {
        console.error("🚨 FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user, jobId, isLoaded]);

  if (loading) {
    return <div className="p-10">Loading report...</div>;
  }

  if (!data) {
    return (
      <div className="p-10 text-red-500">
        ❌ No report found (check console)
      </div>
    );
  }

  const getColor = (value) => {
    if (value <= 5) return "#ef4444";
    if (value <= 8) return "#3b82f6";
    return "#22c55e";
  };

  const overallScore =
    Object.values(data.scores || {}).reduce((a, b) => a + b, 0) /
    Object.values(data.scores || {}).length;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        {data.jobTitle} Report
      </h1>

      <h2
        className="text-4xl font-bold"
        style={{ color: getColor(overallScore) }}
      >
        {(overallScore * 10).toFixed(0)}%
      </h2>

      <p className="mt-4 text-gray-600">{data.summary}</p>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Final Decision</h3>
        <span
          className="px-4 py-2 rounded-lg text-white"
          style={{
            backgroundColor:
              data.hire_recommendation === "Hire"
                ? "#22c55e"
                : "#ef4444",
          }}
        >
          {data.hire_recommendation}
        </span>
      </div>
    </div>
  );
}