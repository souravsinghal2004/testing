import { NextResponse } from "next/server";
import User from "../../models/User";
import { connectDB } from "../../lib/mongo";

export async function POST(req) {
  try {
    await connectDB();

    const { clerkId, name, email } = await req.json();

    console.log("🔥 SAVE USER:", clerkId);

    const result = await User.updateOne(
      { clerkId },
      {
        $set: {
          name,
          email,
        },
        $setOnInsert: {
          role: "CANDIDATE", // ✅ only first time
        },
      },
      { upsert: true }
    );

    console.log("🛠️ UPDATE RESULT:", result);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.log("❌ ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}