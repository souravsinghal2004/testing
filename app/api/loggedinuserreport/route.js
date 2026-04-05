import { connectDB } from "@/app/lib/mongo";
import Report from "@/app/models/Report";

export async function GET(req) {
  try {
   

    await connectDB();
    

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const jobId = searchParams.get("jobId");

   

    let query = {};

    if (userId) query.userId = userId;
    if (jobId) query.jobId = jobId;

    
    const reports = await Report.find(query).sort({ createdAt: -1 });


    return Response.json(reports);
  } catch (err) {
  
    return Response.json({ error: "Server error" });
  }
}