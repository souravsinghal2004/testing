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

      console.log("👤 USER:", user);
      console.log("🔑 KEYWORDS:", user?.keywords);

      // ❌ NO FALLBACK NOW
      if (!user || !user.keywords || user.keywords.length === 0) {
        return Response.json([]); // 🔥 EMPTY ARRAY
      }

      const keywords = user.keywords;

      // 🔥 BETTER REGEX SAFE
      const regex = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");

      jobs = await Job.find({
        title: {
          $regex: regex,
          $options: "i",
        },
      });
    } else {
      // ❌ optional: agar userId nahi toh bhi empty return kar
      return Response.json([]);
    }

    return Response.json(jobs);

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}