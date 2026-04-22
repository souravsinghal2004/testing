"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/inside/Header";

export default function ResultsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchReports = async () => {
      try {
        const res = await fetch(`/api/recruiter/results/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          setReports(data.reports);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">

      <Header />

      <div className="max-w-6xl mx-auto py-16 px-6">

        <h1 className="text-3xl font-bold text-blue-300 mb-8">
          Candidate Results
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : reports.length === 0 ? (
          <h1 className="text-white text-3xl">Till Now no one has given interview.</h1>
        ) : (

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

            <table className="w-full text-sm text-left">

              {/* HEADER */}
              <thead className="bg-white/10 text-blue-300">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">AI Score</th>
                  <th className="p-4">AI Decision</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {reports.map((rep, index) => {
                  
                  // 🔥 calculate average score
                  const scoreValues = Object.values(rep.scores || {});
                  const avgScore =
                    scoreValues.length > 0
                      ? (
                          scoreValues.reduce((a, b) => a + b, 0) /
                          scoreValues.length
                        ).toFixed(1)
                      : "N/A";

                  return (
                    <tr
                      key={rep._id}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="p-4">{index + 1}</td>

                      <td className="p-4 font-semibold">
                        {rep.candidateName}
                      </td>

                      <td className="p-4 text-blue-400 font-semibold">
                        {avgScore}
                      </td>

                      <td
                        className={`p-4 font-semibold ${
                          rep.hire_recommendation === "Hire"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {rep.hire_recommendation}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            router.push(`/recruiter/results/${id}/${rep._id}`)
                          }
                          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          View Detailed Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}