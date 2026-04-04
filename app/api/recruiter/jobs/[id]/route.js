import { connectDB } from "@/app/lib/mongo";
import Job from "@/app/models/Job";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const params = await context.params; // ✅ FIX

  await connectDB();

  const job = await Job.findById(params.id);

  if (!job) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true, job });
}

export async function DELETE(req, context) {
  const params = await context.params; // ✅ FIX

  await connectDB();

  await Job.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}
