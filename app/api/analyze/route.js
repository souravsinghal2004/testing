import { openrouter, MODEL } from "@/app/lib/openrouter";
import { connectDB } from "@/app/lib/mongo";
import Report from "@/app/models/Report";

export async function POST(req) {
  try {
    await connectDB(); // ✅ connect Mongo

  const { qa, jobTitle, candidateName, userId, jobId } = await req.json();

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
${JSON.stringify(qa)}
`;

    const response = await openrouter.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    let text = response.choices[0].message.content;

    // 🔥 CLEAN JSON
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

    // ✅ SAVE TO DB
 // ✅ SAVE OR UPDATE (UPSERT)
const savedReport = await Report.findOneAndUpdate(
  { userId, jobId }, // 🔍 condition to find existing report
  {
    candidateName,
    jobTitle,
    userId,
    jobId,
    qa,
    ...data,
  },
  {
    new: true,      // return updated document
    upsert: true,   // create if not exists
  }
);


console.log("✅ SAVED REPORT:", savedReport);


  console.log("👉 BODY:", {
  candidateName,
  jobTitle,
  userId,
  jobId,
  qa
});

    return Response.json({
      success: true,
      report: savedReport,
    });

  } catch (err) {
    console.error(err);

    return Response.json({
      error: "Server error",
    });
  }

}