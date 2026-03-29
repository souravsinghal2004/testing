"use client";

import { Header } from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InterviewResultsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth check
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // ✅ FETCH REPORTS FROM NEW API
  useEffect(() => {
    if (!user) return;

    async function fetchInterviews() {
      try {
        const res = await fetch(
          `/api/loggedinuserreport?userId=${user.id}`
        );

        const data = await res.json();

        setInterviews(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews();
  }, [user]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100   ">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r px-6 py-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100   ">
          <h2 className="text-xl font-bold text-blue-600 mb-8">
            Candidate Panel
          </h2>

          <nav className="space-y-4 text-gray-700">
            <button
              onClick={() => router.push("/login")}
              className="block w-full text-left hover:text-blue-600"
            >
              💼 Available Jobs
            </button>

            <button className="block w-full text-left font-semibold text-blue-600">
              📊 Interview Results
            </button>

            <button
              onClick={() => router.push("/login/feedback")}
              className="block w-full text-left hover:text-blue-600"
            >
              🧠 Skill Feedback
            </button>

            <button
              onClick={() => router.push("/login/profile")}
              className="block w-full text-left hover:text-blue-600"
            >
              📄 Profile & Resume
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Interview Results
          </h1>

          <p className="text-gray-600 mb-8">
            View AI-generated scores and recruiter shortlisting status.
          </p>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6">Loading reports...</div>
            ) : interviews.length === 0 ? (
              <div className="p-6 text-gray-500">
                No reports found.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-4">Job Role</th>
                    <th className="p-4">Interview Date</th>
                    <th className="p-4">AI Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {interviews.map((item) => {
                    // 🔥 calculate score
                    const avgScore =
                      item?.scores
                        ? Math.round(
                            (Object.values(item.scores).reduce(
                              (a, b) => a + b,
                              0
                            ) /
                              Object.values(item.scores).length) *
                              10
                          )
                        : 0;

                    return (
                      <tr key={item._id} className="border-t">
                        {/* ✅ jobTitle */}
                        <td className="p-4">{item.jobTitle}</td>

                        {/* ✅ createdAt */}
                        <td className="p-4">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>

                        {/* ✅ AI Score */}
                        <td className="p-4 font-semibold">
                          {avgScore}%
                        </td>

                        {/* ✅ Status from hire_recommendation */}
                        <td
                          className={`p-4 font-medium ${
                            item.hire_recommendation === "Hire"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.hire_recommendation}
                        </td>

                        {/* ✅ REDIRECT TO DASHBOARD */}
                        <td className="p-4">
                          <button
                            onClick={() =>
                              router.push(
                                `/login/dashboard/${item.jobId}`
                              )
                            }
                            className="text-blue-600 text-sm hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-6">
            * AI scores assist in evaluation. Final decision is by recruiters.
          </p>
        </main>
      </div>
    </div>
  );
}