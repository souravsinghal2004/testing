import { openrouter, MODEL } from "@/app/lib/openrouter";
import { connectDB } from "@/app/lib/mongo";
import Report from "@/app/models/Report";

export async function POST(req) {
  try {
    await connectDB();

    const { qa, jobTitle, candidateName, userId, jobId } = await req.json();

    // 1. Deduplicate by question text to prevent duplicates in DB and AI Analysis
    const uniqueQA = Array.from(
      new Map(qa.map((item) => [item.question, item])).values()
    );

    const prompt = `
You are an expert HR interviewer.
Return ONLY valid JSON in this format:

{
  "scores": {
    "communication": number,
    "technical_knowledge": number,
    "problem_solving": number,
    "confidence": number,
    "leadership": number,
    "teamwork": number,
    "adaptability": number,
    "clarity": number,
    "relevance": number
  },
  "questionAnalysis": [
    {
      "question": "",
      "score": number,
      "feedback": ""
    }
  ],
  "strengths": [],
  "weaknesses": [],
  "summary": "",
  "hire_recommendation": "Hire" | "No Hire"
}

Candidate Name: ${candidateName}
Job Role: ${jobTitle}

Q&A:
${JSON.stringify(uniqueQA)}
`;

    // 2. Call AI with unique data
    const response = await openrouter.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    let text = response.choices[0].message.content;
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        scores: {},
        summary: "Failed to analyze",
      };
    }

    // 3. Save uniqueQA to the database
    const savedReport = await Report.findOneAndUpdate(
      { userId, jobId },
      {
        candidateName,
        jobTitle,
        userId,
        jobId,
        qa: uniqueQA, // Use deduplicated array here
        ...data,
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log("✅ SAVED REPORT (Deduplicated):", savedReport._id);

    return Response.json({
      success: true,
      report: savedReport,
    });

  } catch (err) {
    console.error("❌ Analysis Error:", err);
    return Response.json({
      error: "Server error",
    });
  }
}