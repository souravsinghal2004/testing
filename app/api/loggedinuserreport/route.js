import { connectDB } from "@/app/lib/mongo";
import Report from "@/app/models/Report";

export async function GET(req) {
  try {
    console.log("🔥 API HIT: /api/loggedinuserreport");

    await connectDB();
    console.log("✅ DB CONNECTED");

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const jobId = searchParams.get("jobId");

    console.log("👤 USER ID:", userId);
    console.log("💼 JOB ID:", jobId);

    let query = {};

    if (userId) query.userId = userId;
    if (jobId) query.jobId = jobId;

    console.log("🔍 FINAL QUERY:", query);

    const reports = await Report.find(query).sort({ createdAt: -1 });

    console.log("📊 REPORTS FOUND:", reports.length);
    console.log("📄 REPORT DATA:", reports);

    return Response.json(reports);
  } catch (err) {
    console.error("🚨 API ERROR:", err);
    return Response.json({ error: "Server error" });
  }
}