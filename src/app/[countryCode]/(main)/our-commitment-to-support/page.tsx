"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Commitment {
  id: number;
  pageTitle: string;
  content: string;
}

export default function CommitmentToSupportPage() {
  const [data, setData] = useState<Commitment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/our-commitment-to-supports`
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const result = await res.json();

        // ✅ Strapi v4 structure
        const item = result.data[0];

        setData({
          id: item.id,
          pageTitle: item.pageTitle,
          content: item.content,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  if (!data) return null;

  return (
    <main>
      {/* Hero Banner */}
      <div className="static-banner">
        <div className="static-banner-overlay"></div>
        <div className="static-banner-content">
          <h1>{data.pageTitle}</h1>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="max-w-5xl mx-auto px-6 py-14">
              <div className="prose prose-lg max-w-none text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {data.content}
                </ReactMarkdown>
              </div>
            </div>
    </main>
  );
}
