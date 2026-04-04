import { connectDB } from "@/app/lib/mongo";
import Job from "@/app/models/Job";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    console.log("🔥 API HIT: /api/recruiter/jobs");

    const { userId } = await auth(); // ✅ async auth
    console.log("👤 Clerk userId:", userId);

    if (!userId) {
      console.log("❌ No userId found → Unauthorized");
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized - No userId" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB(); // ✅ now defined
    console.log("✅ DB Connected");

    const jobs = await Job.find({ createdBy: userId }).sort({ createdAt: -1 });
    console.log("📦 Jobs found:", jobs.length);

    return new Response(JSON.stringify({ success: true, jobs }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("💥 ERROR:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}