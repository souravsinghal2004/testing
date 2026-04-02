import { NextResponse } from "next/server";
import User from "../../models/User";
import { connectDB } from "../../lib/mongo";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json(
        { error: "clerkId is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json({ hasResume: false });
    }

    const hasResume = user.keywords && user.keywords.length > 0;

    return NextResponse.json({ hasResume });

  } catch (err) {
    console.log("ERROR:", err);
    return NextResponse.json(
      { error: "Failed to check resume" },
      { status: 500 }
    );
  }
}