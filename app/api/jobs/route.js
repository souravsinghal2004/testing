import { connectDB } from "@/app/lib/mongo";
import Job from "@/app/models/Job";
import User from "@/app/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    let jobs = [];

    if (userId) {
     const user = await User.findOne({ clerkId: userId });

      if (!user || !user.keywords || user.keywords.length === 0) {
        // fallback → sab jobs dikha de
        jobs = await Job.find();
      } else {
        // 🔥 MATCHING LOGIC
        const keywords = user.keywords;

        jobs = await Job.find({
          title: {
            $regex: keywords.join("|"),
            $options: "i", // case insensitive
          },
        });
      }
    } else {
      jobs = await Job.find();
    }

    return Response.json(jobs);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}