"use client";

import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}