"use client";

import { useState } from "react";
import pdfToText from "react-pdftotext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Header } from "@/components/inside/Header";

export default function UploadPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const MAX_SIZE = 2 * 1024 * 1024; // ✅ 2MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // ❌ File type check
      if (selectedFile.type !== "application/pdf") {
        alert("Sirf PDF file upload kar bhai");
        return;
      }

      // ❌ File size check
      if (selectedFile.size > MAX_SIZE) {
        alert("File size 2MB se zyada nahi honi chahiye");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
  if (!file) {
    alert("Pehle PDF upload kar bhai");
    return;
  }

  if (!user) {
    alert("Login kar pehle");
    return;
  }

  setLoading(true);

  try {
    let extractedText = "";

    try {
      extractedText = await pdfToText(file);
      console.log("📄 Extracted Text:", extractedText.slice(0, 200));
    } catch (err) {
      alert("PDF read karne mein error aaya");
      setLoading(false);
      return;
    }

    console.log("🚀 Sending to API...");

    const res = await fetch("/api/resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText: extractedText,
        userId: user.id,
      }),
    });

    const data = await res.json();

    console.log("📦 API RESPONSE:", data);

    // 🔥 IMPORTANT CHECK
    if (!res.ok || !data.success || !data.keywords?.length) {
      throw new Error("Keywords not saved properly");
    }

    console.log("✅ FINAL KEYWORDS:", data.keywords);

    // 🔥 redirect AFTER everything confirmed
    router.push("/login");
    router.refresh();

  } catch (err) {
    console.error("❌ ERROR:", err);
    alert(err.message || "Something went wrong");
  }

  setLoading(false);
};

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">
      <Header />

      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-xl rounded-3xl bg-gradient-to-r from-black via-blue-900 to-blue-500 p-[1px] shadow-2xl">
          <div className="rounded-3xl bg-[#020617] p-8 text-center">

            <h1 className="text-3xl font-bold text-blue-400 mb-2">
              Upload Resume
            </h1>
            <p className="text-gray-400 mb-6">
              Let AI analyze your resume and match jobs 🚀
            </p>

            <label className="block border-2 border-dashed border-blue-500/30 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-gray-300">
                {file ? file.name : "Click to upload PDF (Max 2MB)"}
              </p>
            </label>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
            >
              {loading ? "Processing..." : "Upload & Analyze"}
            </button>

            {loading && (
              <div className="flex flex-col items-center mt-6">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400 mt-3">
                  AI is analyzing your resume...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}