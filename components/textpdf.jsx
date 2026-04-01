"use client";
import { useState } from "react";
import pdfToText from "react-pdftotext";

export default function UploadPDF() {
  const [text, setText] = useState("");

  const extractText = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    pdfToText(file)
      .then((res) => {
        console.log("===== TEXT START =====");
        console.log(res);
        console.log("===== TEXT END =====");

        setText(res);
      })
      .catch((err) => {
        console.error("ERROR:", err);
      });
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={extractText} />

      <h2>Extracted Text:</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
}