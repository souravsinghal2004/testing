import { connectDB } from "@/app/lib/mongo";
import Report from "@/app/models/Report";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    console.log("🔥 API HIT - FETCH SINGLE REPORT");

    await connectDB();
    console.log("✅ DB CONNECTED");

    // 🔥 IMPORTANT (Next.js new fix)
    const { reportId } = await params;

    console.log("📄 REPORT ID RECEIVED:", reportId);

    // ❌ INVALID ID CHECK
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      console.log("❌ INVALID OBJECT ID");

      return NextResponse.json({
        success: false,
        message: "Invalid Report ID",
      });
    }

    // 🔍 FETCH REPORT
    const report = await Report.findById(reportId);

    console.log("🔎 DB RESULT:", report);

    if (!report) {
      console.log("❌ REPORT NOT FOUND IN DB");

      return NextResponse.json({
        success: false,
        message: "Report not found",
      });
    }

    console.log("✅ REPORT FOUND SUCCESSFULLY");

    return NextResponse.json({
      success: true,
      report,
    });

  } catch (err) {
    console.error("💥 ERROR IN API:", err);

    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}