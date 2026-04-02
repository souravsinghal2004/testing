import { NextResponse } from "next/server";
import { openrouter, MODEL } from "@/app/lib/openrouter";
import { connectDB } from "@/app/lib/mongo";
import User from "@/app/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("📩 REQUEST BODY:", body);

    const { resumeText, userId } = body;

    if (!resumeText) {
      console.log("❌ No resume text");
      return NextResponse.json(
        { error: "No resume text provided" },
        { status: 400 }
      );
    }

    console.log("👤 USER ID:", userId);

    // 🧠 AI CALL
    const completion = await openrouter.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `
Extract ONLY job-related keywords.

Return STRICT JSON:
{
  "keywords": ["frontend developer", "backend developer"]
}
          `,
        },
        {
          role: "user",
          content: resumeText,
        },
      ],
      temperature: 0.2,
    });

    let aiResponse = completion.choices[0].message.content;

    console.log("🤖 RAW AI RESPONSE:", aiResponse);

    // 🔥 SAFE PARSE
    let keywords = [];

    try {
      const cleaned = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      console.log("🧹 CLEANED RESPONSE:", cleaned);

      const parsed = JSON.parse(cleaned);
      keywords = parsed.keywords || [];

    } catch (err) {
      console.log("❌ JSON PARSE ERROR:", err);
      return NextResponse.json(
        { error: "AI response invalid" },
        { status: 500 }
      );
    }

    console.log("✅ FINAL KEYWORDS:", keywords);

    // 💾 SAVE TO DB
    if (userId) {
      const updated = await User.findOneAndUpdate(
        { clerkId: userId },
        { $set: { keywords: keywords } },
        { new: true, upsert: true }
      );

      console.log("💾 SAVED IN DB:", updated?.keywords);
    }

    return NextResponse.json({
      success: true,
      keywords,
    });

  } catch (error) {
    console.error("❌ SERVER ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}