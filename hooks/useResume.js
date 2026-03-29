import { useState } from "react";

export default function useResume() {
  const [loading, setLoading] = useState(false);

  const uploadResume = async (file) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      return data.success;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { uploadResume, loading };
}