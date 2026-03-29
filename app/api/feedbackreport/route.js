import { connectDB } from "@/app/lib/mongo";
import Report from "@/app/models/Report";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const reports = await Report.find({ userId }).sort({ createdAt: -1 });

  return Response.json(reports);
}