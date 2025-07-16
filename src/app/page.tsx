"use client"
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/generate-video", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
      <button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Video"}</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </form>
  );
}