"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Training } from "types/training";

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTraining() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/trainings?populate=*`
        );

        if (!res.ok) throw new Error("Failed to fetch training content");

        const data = await res.json();

        const formatted = data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
        }));

        setTrainings(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTraining();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500"></p>;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <main>
      {/* Hero */}
      <div className="static-banner">
    <div className="static-banner-overlay"></div>
    <div className="static-banner-content">
      <h1>{trainings[0].title}</h1>

    </div>
  </div>

      {/* Training Sections */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {trainings.map((training) => (
          <div
            key={training.id}
            className="border rounded-xl p-6 shadow-sm bg-white"
          >
            <div
  className="text-gray-700 prose prose-lg max-w-none
  [&_ul]:!list-disc 
  [&_ul]:!pl-6
  [&_li]:!list-item"
>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {training.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
