import { connectDB } from "@/app/lib/mongo";
import Report from "@/app/models/Report";

export async function GET() {
  try {
    await connectDB();

    const reports = await Report.find().sort({ createdAt: -1 });

    return Response.json(reports);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch reports" });
  }
}