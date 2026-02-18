"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type About = {
  id: number;
  title: string;
  content: string;
};

export default function AboutUsPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/about-uses?populate=*`
        );

        if (!res.ok) throw new Error("Failed to fetch About Us content");

        const data = await res.json();

        if (data.data.length > 0) {
          setAbout({
            id: data.data[0].id,
            title: data.data[0].title,
            content: data.data[0].content,
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAbout();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  if (!about) return null;

  return (
    <main>
      {/* Hero */}
      <div className="static-banner">
      <div className="static-banner-overlay"></div>
      <div className="static-banner-content">
        <h1>{about.title}</h1>

      </div>
    </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="prose prose-lg max-w-none text-gray-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {about.content}
          </ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
