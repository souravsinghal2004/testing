import { connectDB } from "@/app/lib/mongo";
import Report from "@/app/models/Report";
import { auth } from "@clerk/nextjs/server";

export async function GET(req, context) {
  try {
    const { params } = context;

    const { id } = await params; // ✅ FIX HERE

    console.log("JOB ID:", id);

    await connectDB();

    const reports = await Report.find({ jobId: id })
      .sort({ createdAt: -1 });

    return Response.json({ success: true, reports });

  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message });
  }
}