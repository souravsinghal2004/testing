import pdfParse from "pdf-parse";

/**
 * Extract text from PDF buffer
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);

    // Clean text (optional but recommended)
    let text = data.text;

    text = text
      .replace(/\s+/g, " ")      // remove extra spaces
      .replace(/\n/g, " ")       // remove new lines
      .trim();

    return text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to parse PDF");
  }
}