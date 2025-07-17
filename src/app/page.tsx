"use client"
import { useState } from "react";
import { Header } from "./components/Header";
import { ExplenationSection } from "./components/ExplenationSection";
import { UploadForm } from "./components/UploadForm";
import { Frame } from "./types/Frame";
import { getFrames } from "./services/framesService";
import { randomUUID } from "crypto";

export default function Home() {
  const [result, setResult] = useState<Frame[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, file: File | null) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const data = await getFrames(file)

    setResult(data.frames);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Header />
      <main className="flex flex-row items-center justify-around h-full w-full">
        <ExplenationSection />
        <UploadForm onSubmit={handleSubmit} loading={loading} />
      </main>
      {result && <div className="flex flex-row items-center justify-center h-full w-full">
        {result.map((frame) => (
          <img key={frame.url} src={frame.url} alt="frame" />
        ))}
      </div>}
    </div>
  );
}