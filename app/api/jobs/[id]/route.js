import { connectDB } from "@/app/lib/mongo";
import Job from "@/app/models/Job";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  console.log("🚀 API /jobs/[id] called");

  try {
    console.log("⏳ Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");

    const { id } = await context.params; // <-- MUST await

    console.log("📌 PARAM ID:", id);

    const job = await Job.findById(id);

    if (!job) {
      console.log("❌ Job not found");
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    console.log("✅ Job found:", job.title, "with", job.questions?.length, "questions");

    return NextResponse.json(JSON.parse(JSON.stringify(job)));
  } catch (error) {
    console.error("❌ Failed to fetch job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}