import { connectDB } from "@/app/lib/mongo";
import Job from "@/app/models/Job";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";


export async function POST(req) {
  try {
    console.log("🔥 API HIT");

    const { userId } = await auth(); // ✅ IMPORTANT CHANGE
    console.log("👤 USER ID:", userId);

    if (!userId) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await connectDB();

    const jobId = "JOB_" + Date.now();

    let finalQuestions = [];

    if (body.questionMode === "AI") {
      finalQuestions = [];
    } 
    else if (body.questionMode === "HYBRID") {
      const aiCount = body.no_of_questions - body.questions.length;

      const ai = Array(aiCount > 0 ? aiCount : 0)
        .fill(0)
        .map((_, i) => `AI Generated Question ${i + 1}`);

      finalQuestions = [...body.questions, ...ai];
    } 
    else {
      finalQuestions = body.questions;
    }

    const job = await Job.create({
      ...body,
  startDate:
    body.startDate && !isNaN(new Date(body.startDate).getTime())
      ? new Date(body.startDate).toISOString()
      : null,


      jobId,
      createdBy: userId,
      applicants: 0,
      questions: finalQuestions,
      createdAt: new Date(),
    });

    return Response.json({ success: true, job });

  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message });
  }
}