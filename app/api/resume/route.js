import { NextResponse } from "next/server";
import { openrouter, MODEL } from "@/app/lib/openrouter";
import { connectDB } from "@/app/lib/mongo";
import User from "@/app/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { resumeText, userId } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
    }

    // 🧠 AI CALL
    const completion = await openrouter.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `
You are an AI resume analyzer.

Extract ONLY job-related keywords based on the candidate's skills and experience.

Return STRICT JSON in this format:
{
  "keywords": ["frontend developer", "backend developer", "full stack developer"]
}

Rules:
- Only return array of job roles or domains
- No explanation
- No extra text
- Max 10 keywords
- Keep them industry relevant
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

    // 🔥 Parse JSON safely
    let keywords = [];

    try {
      const parsed = JSON.parse(aiResponse);
      keywords = parsed.keywords || [];
    } catch (err) {
      console.log("AI JSON parse error:", err);
      return NextResponse.json({ error: "AI response invalid" }, { status: 500 });
    }

    // 💾 Save to DB
// 💾 Save to DB
if (userId) {
  await User.findOneAndUpdate(
    { clerkId: userId },
    { keywords: keywords }
  );
}

    return NextResponse.json({
      success: true,
      keywords,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}