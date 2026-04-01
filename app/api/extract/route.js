import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Node.js environment ke liye legacy build load karein
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Important: Disable worker to avoid "Module not found" errors on server
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      disableFontFace: true, // Server par fonts load nahi karne
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Page ka text join karein
      const pageText = textContent.items
        .map((item) => item.str)
        .join(" ");
        
      fullText += pageText + "\n\n";
    }

    console.log("===== EXTRACTED TEXT START =====");
    console.log(fullText);
    console.log("===== END =====");

    return NextResponse.json({
      message: "Success",
      text: fullText,
    });

  } catch (err) {
    console.error("FINAL EXTRACTION ERROR:", err);
    return NextResponse.json({ 
      error: "Extraction failed", 
      details: err.message 
    }, { status: 500 });
  }
}